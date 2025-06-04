import { Component, OnInit } from '@angular/core';
import { F1ApiService } from '../../core/services/f1-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  availableYears: number[] = [];
  selectedYear: number = 2025;

  searchControl = new FormControl('');
  allDrivers: any[] = [];
  filteredDrivers: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  loading = false;

  teamsMap = new Map<string, { name: string; nationality: string }>();

  constructor(
    private readonly f1Api: F1ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.generateYears(1950, 2025);
    this.listenToSearch();
    this.loadTeamsForYear(this.selectedYear);

    this.route.queryParams.subscribe((params) => {
      this.selectedYear = +params['year'] || 2025;
      this.searchControl.setValue(params['q'] || '', { emitEvent: false });
      this.performSearch();
    });
  }

  generateYears(start: number, end: number): void {
    this.availableYears = Array.from({ length: end - start + 1 }, (_, i) => end - i);
  }

  listenToSearch(): void {
    this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.updateQueryParams();
      this.performSearch();
    });
  }

  updateQueryParams(): void {
    const queryParams: any = {
      year: this.selectedYear
    };

    if (this.searchControl.value?.trim()) {
      queryParams.q = this.searchControl.value;
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  performSearch(): void {
    const query = this.searchControl.value?.trim().toLowerCase() || '';

    if (query.length >= 4) {
      this.loading = true;

      this.f1Api.searchDrivers(query).subscribe({
        next: (res) => {
          const searchResults = res.drivers ?? [];

          this.f1Api.getDrivers(this.selectedYear).subscribe({
            next: (yearRes) => {
              const yearDriverIds = new Set(
                (yearRes.drivers ?? []).map((d: any) => d.driverId)
              );
              this.allDrivers = searchResults.filter((d: any) =>
                yearDriverIds.has(d.driverId)
              );
              this.filteredDrivers = this.paginate(this.allDrivers);
              this.loading = false;
            },
            error: () => {
              this.allDrivers = [];
              this.filteredDrivers = [];
              this.loading = false;
            }
          });
        },
        error: () => {
          this.allDrivers = [];
          this.filteredDrivers = [];
          this.loading = false;
        }
      });
    } else {
      this.allDrivers = [];
      this.filteredDrivers = [];
    }
  }

  loadTeamsForYear(year: number): void {
  this.f1Api.getTeams(year).subscribe({
    next: (res) => {
      const teams = res.teams ?? [];
      teams.forEach((team: any) => {
        this.teamsMap.set(team.teamId, {
          name: team.teamName,
          nationality: team.teamNationality
        });
      });
    },
    error: () => {
      console.warn(`No se pudieron cargar los equipos para el año ${year}`);
    }
  });
}


  paginate(data: any[]): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return data.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filteredDrivers = this.paginate(this.allDrivers);
  }

  onYearChange(): void {
    this.updateQueryParams();
    this.performSearch();
    this.loadTeamsForYear(this.selectedYear);
  }

  getFlag(country: string): string {
  const flags: { [key: string]: string } = {
    'Argentine': '🇦🇷',
    'Netherlands': '🇳🇱',
    'Germany': '🇩🇪',
    'Great Britain': '🇬🇧',
    'British': '🇬🇧',
    'Spain': '🇪🇸',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Brazil': '🇧🇷',
    'Brazilian': '🇧🇷',
    'Australia': '🇦🇺',
    'Australian': '🇦🇺',
    'Polish': '🇵🇱',
    'Japan': '🇯🇵',
    'Japanese': '🇯🇵',
    'Russian': '🇷🇺',
    'Switzerland': '🇨🇭',
    'Swiss': '🇨🇭',
    'USA': '🇺🇸',
    'United States': '🇺🇸',
    'Finnish': '🇫🇮',
    'Austrian': '🇦🇹',
    'Indian': '🇮🇳',
    'Spanish': '🇪🇸',
    // default
    'default': '🏁'
  };

  return flags[country] || flags['default'];
}

}
