import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { F1ApiService } from '../../core/services/f1-api.service';
import { DriversChampionshipResponse, ChampionshipDriver, ConstructorsChampionshipResponse, ChampionshipConstructor } from '../../core/models/models';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NgxChartsModule],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  selectedYear: number = 2025;
  driverData: { name: string; value: number }[] = [];
  constructorData: { name: string; value: number }[] = [];

  private readonly yearChange$ = new Subject<number>();
  private readonly location = inject(Location);
  private readonly f1Api = inject(F1ApiService);

  ngOnInit(): void {
    this.yearChange$.pipe(debounceTime(500)).subscribe((year) => {
      this.loadStandings(year);
    });

    this.yearChange$.next(this.selectedYear);
  }

  loadStandings(year: number): void {
    this.f1Api.getTopDriversByYear(year).subscribe({
      next: (drivers: ChampionshipDriver[]) => {
        this.driverData = drivers.slice(0, 5).map((d) => ({
          name: `${d.driver.name} ${d.driver.surname}`,
          value: d.points,
        }));
      },
      error: (err) => {
        console.error('Drivers error', err.status, err.message);
        this.driverData = [];
      },
    });

    this.f1Api.getTopConstructorsByYear(year).subscribe({
      next: (constructors: ChampionshipConstructor[]) => {
        const data = constructors;
        this.constructorData = data.slice(0, 5).map((c: ChampionshipConstructor) => ({
          name: c.team.teamName,
          value: c.points,
        }));
      },
      error: (err) => {
        console.error('Constructors error', err.status, err.message);
        this.constructorData = [];
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
