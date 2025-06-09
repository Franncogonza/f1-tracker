import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { F1ApiService } from '../../core/services/f1-api.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NgxChartsModule
  ],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  selectedYear = 2025;
  driverData: { name: string; value: number }[] = [];
  private readonly yearChange$ = new Subject<number>();

  constructorData: { name: string; value: number }[] = [];

  private readonly f1Api = inject(F1ApiService);

 ngOnInit(): void {
  this.yearChange$
    .pipe(debounceTime(500))
    .subscribe((year) => {
      this.loadStandings(year);
    });

  // Llamada inicial
  this.yearChange$.next(this.selectedYear);
}


loadStandings(year: number): void {
  this.f1Api.getTopDriversByYear(year).subscribe({
    next: (res: any) => {
      const data = res?.drivers_championship;
      if (Array.isArray(data)) {
        this.driverData = data.slice(0, 5).map((d: any) => ({
          name: `${d.driver.name} ${d.driver.surname}`,
          value: +d.points
        }));
      } else {
        console.warn('drivers_championship no es un array');
        this.driverData = [];
      }
    },
    error: (err) => {
      console.error('Drivers error', err.status, err.message);
      this.driverData = [];
    }
  });

  this.f1Api.getTopConstructorsByYear(year).subscribe({
    next: (res: any) => {
      const data = res?.constructors_championship;
      if (Array.isArray(data)) {
        this.constructorData = data.slice(0, 5).map((c: any) => ({
          name: c.team.teamName,
          value: +c.points
        }));
      } else {
        console.warn('constructors_championship no es un array');
        this.constructorData = [];
      }
    },
    error: (err) => {
      console.error('Constructors error', err.status, err.message);
      this.constructorData = [];
    }
  });
}

onYearChange(year: number): void {
  this.selectedYear = year;
  this.yearChange$.next(year);
}

}
