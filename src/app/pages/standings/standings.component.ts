import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { F1ApiService } from '../../core/services/f1-api.service';
import { ChampionshipDriver, ChampionshipConstructor } from '../../core/models/models';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NgxChartsModule, NzAlertModule],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit, OnDestroy {
  selectedYear: number = 2025;
  driverData: { name: string; value: number }[] = [];
  constructorData: { name: string; value: number }[] = [];
  driverError = false;
  constructorError = false;

  private readonly yearChange$ = new Subject<number>();
  private readonly location = inject(Location);
  private readonly f1Api = inject(F1ApiService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
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
    this.driverError = false;
    this.constructorError = false;

    this.loadChartData<ChampionshipDriver>(
      () => this.f1Api.getTopDriversByYear(year),
      (drivers) => {
        this.driverData = drivers.slice(0, 5).map(d => ({
          name: `${d.driver.name} ${d.driver.surname}`,
          value: d.points,
        }));
      },
      () => {
        this.driverError = true;
        this.driverData = [];
      },
      'Drivers'
    );

    this.loadChartData<ChampionshipConstructor>(
      () => this.f1Api.getTopConstructorsByYear(year),
      (constructors) => {
        this.constructorData = constructors.slice(0, 5).map(c => ({
          name: c.team.teamName,
          value: c.points,
        }));
      },
      () => {
        this.constructorError = true;
        this.constructorData = [];
      },
      'Constructors'
    );
  }

  private loadChartData<T>(
    requestFn: () => Observable<T[]>,
    onSuccess: (data: T[]) => void,
    onError: () => void,
    label: string
  ): void {
    requestFn().subscribe({
      next: (data) => onSuccess(data),
      error: (err) => {
        console.error(`${label} error`, err.status, err.message);
        onError();
      }
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
