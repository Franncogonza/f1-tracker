import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { F1ApiService } from '../../core/services/f1-api.service';
import { Driver, Team } from '../../core/models/models';
import { GetFlagPipe } from '../../core/pipes/get-flag.pipe';

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
    NzPaginationModule,
    GetFlagPipe
  ]
})
export class PilotsSearchComponent implements OnInit, OnDestroy {
  availableYears: number[] = [];
  selectedYear: number | null = 2025;

  searchControl = new FormControl('');
  allDrivers: Driver[] = [];
  filteredDrivers: Driver[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  loading = false;

  teamsMap = new Map<string, { name: string; nationality: string }>();

  private readonly f1Api = inject(F1ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.generateYears(1950, 2025);
    this.listenToSearch();
    this.loadTeamsForYear(this.selectedYear);

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.selectedYear = params['year'] ? +params['year'] : 2025;
      this.searchControl.setValue(params['q'] ?? '', { emitEvent: false });
      this.performSearch();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateYears(start: number, end: number): void {
    this.availableYears = Array.from({ length: end - start + 1 }, (_, i) => end - i);
  }

  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateQueryParams();
        this.performSearch();
      });
  }

   updateQueryParams(): void {
  const queryParams: any = { year: this.selectedYear };

  const query = (this.searchControl.value ?? '').trim();
  if (query) {
    queryParams.q = query;
  } else {
    queryParams.q = null;
  }

  this.router.navigate([], {
    queryParams,
    queryParamsHandling: 'merge'
  });
}

  performSearch(): void {
    const query = this.searchControl.value?.trim().toLowerCase() ?? '';
    this.loading = true;

    this.getSearchObservable(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers) => {
          this.allDrivers = this.filterByYear(drivers);
          this.filteredDrivers = this.paginate(this.allDrivers);
          this.loading = false;
        },
        error: () => this.handleError()
      });
  }

  private getSearchObservable(query: string) {
    if (query.length >= 4) {
      return this.f1Api.searchDrivers(query);
    } else if (this.selectedYear) {
      return this.f1Api.getDrivers(this.selectedYear);
    } else {
      return this.f1Api.getAllDrivers();
    }
  }

  private filterByYear(drivers: Driver[]): Driver[] {
    if (!this.selectedYear) return drivers;
    return drivers;
  }

  private handleError(): void {
    this.allDrivers = [];
    this.filteredDrivers = [];
    this.loading = false;
  }

  loadTeamsForYear(year: number | null): void {
    if (!year) return;
    this.f1Api.getTeams(year).pipe(takeUntil(this.destroy$)).subscribe({
      next: (teams: Team[]) => {
        teams.forEach((team: Team) => {
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

  paginate(data: Driver[]): Driver[] {
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

  goBack(): void {
    this.location.back();
  }
}
