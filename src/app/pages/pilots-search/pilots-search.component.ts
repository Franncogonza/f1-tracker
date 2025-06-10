import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { debounceTime, takeUntil, switchMap, tap, map, startWith } from 'rxjs/operators';
import { Observable, Subject, combineLatest, of } from 'rxjs';

import { F1ApiService } from '../../core/services/f1-api.service';
import { Driver, Team } from '../../core/models/models';
import { GetFlagPipe } from '../../core/pipes/get-flag.pipe';
import { generateYears } from '../../core/utils/generate-years';

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
    NzEmptyModule,
    GetFlagPipe
  ]
})
export class PilotsSearchComponent implements OnInit, OnDestroy {
  availableYears: number[] = [];
  selectedYear: number | null = null;

  searchControl = new FormControl('');

  allDrivers: Driver[] = [];
  filteredDrivers: Driver[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  teamsMap = new Map<string, { name: string; nationality: string }>();

  private readonly f1Api = inject(F1ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroy$ = new Subject<void>();

  isLoadingDrivers$: Observable<boolean> = combineLatest([
    this.f1Api.isLoadingDrivers$,
  ]).pipe(
    map(loadingStates => loadingStates.some(isLoading => isLoading))
  );
  isLoadingTeams$: Observable<boolean> = this.f1Api.isLoadingTeams$;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = generateYears(1950, currentYear + 1).sort((a, b) => b - a);

    this.route.queryParams.pipe(
      takeUntil(this.destroy$),
      tap(params => {
        this.selectedYear = params['year'] ? +params['year'] : null;
        this.searchControl.setValue(params['q'] ?? '', { emitEvent: false });
      }),
      switchMap(() => {
        return this.selectedYear !== null
          ? this.loadTeamsForYear(this.selectedYear)
          : of(true);
      }),
      tap(() => this.performSearch())
    ).subscribe();

    this.listenToSearch();
    this.manageFormControlsDisabledState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private manageFormControlsDisabledState(): void {
    combineLatest([
      this.isLoadingDrivers$,
      this.searchControl.valueChanges.pipe(map(value => (value ?? '').trim().length >= 4), startWith(false))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([isLoading, isSearchQueryLong]) => {
      if (isLoading || isSearchQueryLong) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        this.searchControl.enable({ emitEvent: false });
      }

      if (isLoading) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        this.searchControl.enable({ emitEvent: false });
      }
    });
  }


  generateYears(start: number, end: number): void {
    this.availableYears = generateYears(start, end);
  }

  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$),
        tap(() => this.updateQueryParams())
      )
      .subscribe(() => {
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
    this.currentPage = 1;

    this.getSearchObservable(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers) => {
          this.allDrivers = drivers ?? [];
          this.filterAndPaginateDrivers();
        },
      });
  }

  private getSearchObservable(query: string): Observable<Driver[]> {
    if (query.length >= 4) {
      return this.f1Api.searchDrivers(query);
    } else if (this.selectedYear !== null) {
      return this.f1Api.getDrivers(this.selectedYear);
    } else {
      return this.f1Api.getAllDrivers();
    }
  }

  private filterAndPaginateDrivers(): void {
    this.filteredDrivers = this.paginate(this.allDrivers);
  }

  loadTeamsForYear(year: number): Observable<boolean> {
    this.teamsMap.clear();
    return this.f1Api.getTeams(year).pipe(
      takeUntil(this.destroy$),
      tap((teams: Team[]) => {
        teams.forEach((team: Team) => {
          this.teamsMap.set(team.teamId, {
            name: team.teamName,
            nationality: team.teamNationality
          });
        });
      }),
      map(() => true)
    );
  }

  paginate(data: Driver[]): Driver[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return data.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterAndPaginateDrivers();
  }

  onYearChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    this.loadTeamsForYear(this.selectedYear ?? new Date().getFullYear()).subscribe(() => {
      this.performSearch();
    });
  }

  goBack(): void {
    this.location.back();
  }
}