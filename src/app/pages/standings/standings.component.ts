import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { F1ApiService } from '../../core/services/f1-api.service';
import { ChampionshipDriver, ChampionshipConstructor } from '../../core/models/models';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { generateYears } from '../../core/utils/generate-years';
import { AppButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NgxChartsModule,
    NzSpinModule,
    NzEmptyModule,
    AppButtonComponent
  ],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit, OnDestroy {
  private readonly yearChange$ = new Subject<number>();
  private readonly location = inject(Location);
  private readonly f1Api = inject(F1ApiService);
  private readonly destroy$ = new Subject<void>();

  selectedYear: number = new Date().getFullYear();
  driverData: { name: string; value: number }[] = [];
  constructorData: { name: string; value: number }[] = [];

  availableYears: number[] = [];

  isLoadingDriversChart$: Observable<boolean> = this.f1Api.isLoadingChampionshipDrivers$;
  isLoadingConstructorsChart$: Observable<boolean> = this.f1Api.isLoadingChampionshipConstructors$;

  chartView: [number, number] = [700, 250];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  gradient = false;
  showGridLines = true;
  roundEdges = true;
  xAxisLabelPoints = 'Puntos';
  yAxisLabelDriver = 'Piloto';
  yAxisLabelConstructor = 'Constructor';

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const endYear = currentYear;

    this.availableYears = generateYears(startYear, endYear);
    this.availableYears.sort((a, b) => b - a);

    this.yearChange$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((year) => this.loadStandings(year));
    this.yearChange$.next(this.selectedYear);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStandings(year: number): void {
    this.loadDriverStandings(year);
    this.loadConstructorStandings(year);
  }

  private loadDriverStandings(year: number): void {
    this.f1Api.getTopDriversByYear(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers: ChampionshipDriver[]) => {
          this.driverData = drivers.slice(0, 5).map(d => ({
            name: `${d.driver.name} ${d.driver.surname}`,
            value: d.points,
          }));
        },
      });
  }

  private loadConstructorStandings(year: number): void {
    this.f1Api.getTopConstructorsByYear(year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (constructors: ChampionshipConstructor[]) => {
          this.constructorData = constructors.slice(0, 5).map(c => ({
            name: c.team.teamName,
            value: c.points,
          }));
        },
      });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.yearChange$.next(year);
  }

  goBack(): void {
    this.location.back();
  }
}