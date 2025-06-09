import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { F1ApiService } from '../../core/services/f1-api.service';
import { Driver, DriversResponse } from '../../core/models/models';
import { GetFlagPipe } from '../../core/pipes/get-flag.pipe';

@Component({
  selector: 'app-team-drivers',
  standalone: true,
  imports: [CommonModule, NzSpinModule, NzAlertModule, GetFlagPipe],
  templateUrl: './team-drivers.component.html',
  styleUrls: ['./team-drivers.component.scss'],
})
export class TeamDriversComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly f1Api = inject(F1ApiService);
  private readonly location = inject(Location);

  teamId!: string;
  year!: number;
  teamName: string = '';
  drivers: Driver[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('teamId')!;
    this.year = Number(this.route.snapshot.paramMap.get('year'));

    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.f1Api.getDrivers(this.year).subscribe({
      next: (res: DriversResponse) => {
        const allDrivers = res.drivers ?? [];
        this.drivers = allDrivers.filter((d: Driver) => d.teamId === this.teamId);
        this.teamName = this.drivers[0]?.teamName || this.teamId;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los pilotos del equipo';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}