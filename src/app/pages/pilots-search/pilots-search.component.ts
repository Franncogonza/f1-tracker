import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { debounceTime } from 'rxjs/operators';
import { F1ApiService } from '../../core/services/f1-api.service';

@Component({
  standalone: true,
  selector: 'app-pilots-search',
  templateUrl: './pilots-search.component.html',
  styleUrl: './pilots-search.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzSpinModule,
    NzSelectModule,
    NzInputModule,
    NzCardModule,
    NzPaginationModule
  ]
})
export class PilotsSearchComponent implements OnInit {
  availableYears: number[] = [];
  selectedYear: number | null = 2025;

  searchControl = new FormControl('');
  allDrivers: any[] = [];
  filteredDrivers: any[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  loading = false;

  teamsMap = new Map<string, { name: string; nationality: string }>();

  private readonly f1Api = inject(F1ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.generateYears(1950, 2025);
    this.listenToSearch();
    this.loadTeamsForYear(this.selectedYear);

    this.route.queryParams.subscribe((params) => {
      this.selectedYear = params['year'] ? +params['year'] : 2025;
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
    this.loading = true;

    if (query.length >= 4) {
      this.f1Api.searchDrivers(query).subscribe({
        next: (res) => {
          const searchResults = res.drivers ?? [];

          if (this.selectedYear) {
            this.f1Api.getDrivers(this.selectedYear).subscribe({
              next: (yearRes) => {
                const yearDriverIds = new Set((yearRes.drivers ?? []).map((d: any) => d.driverId));
                this.allDrivers = searchResults.filter((d: any) => yearDriverIds.has(d.driverId));
                this.filteredDrivers = this.paginate(this.allDrivers);
                this.loading = false;
              },
              error: () => this.handleError()
            });
          } else {
            this.allDrivers = searchResults;
            this.filteredDrivers = this.paginate(this.allDrivers);
            this.loading = false;
          }
        },
        error: () => this.handleError()
      });
   } else if (this.selectedYear) {
    // Mostrar todos los pilotos del año
    this.f1Api.getDrivers(this.selectedYear).subscribe({
      next: (res) => {
        this.allDrivers = res.drivers ?? [];
        this.filteredDrivers = this.paginate(this.allDrivers);
        this.loading = false;
      },
      error: () => this.handleError()
    });
  } else {
    // Buscar todos los pilotos (sin filtro por año)
    this.f1Api.getAllDrivers().subscribe({
      next: (res) => {
        this.allDrivers = res.drivers ?? [];
        this.filteredDrivers = this.paginate(this.allDrivers);
        this.loading = false;
      },
      error: () => this.handleError()
    });
  }
}

  private handleError(): void {
    this.allDrivers = [];
    this.filteredDrivers = [];
    this.loading = false;
  }

  loadTeamsForYear(year: number | null): void {
    if (!year) return;

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
    this.currentPage = 1;
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
      'default': '🏁'
    };

    return flags[country] || flags['default'];
  }
}
