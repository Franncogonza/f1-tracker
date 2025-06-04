import { Component, inject, OnInit } from '@angular/core';
import { F1ApiService } from '../../core/services/f1-api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  standalone: false
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  selectedTeam: any = null;
  teamDrivers: any[] = [];
  loading = false;

  availableYears: number[] = [];
  selectedYear = 2025; // Ahora 2025 por defecto
  errorMessage: string | null = null;

  private readonly f1Api = inject(F1ApiService);

  ngOnInit(): void {
      this.generateYears(1950, 2025);
    this.fetchTeams();
  }

  onYearChange(): void {
    this.selectedTeam = null;
    this.teamDrivers = [];
    this.fetchTeams();
  }

fetchTeams(): void {
  this.loading = true;
  this.errorMessage = null;
  this.teams = [];

  this.f1Api.getTeams(this.selectedYear).subscribe({
    next: (res: any) => {
      this.teams = res.teams ?? [];
      this.loading = false;

      if (this.teams.length === 0) {
        this.errorMessage = 'No se encontraron equipos para este año. Probá con otro.';
      }
    },
    error: (err: any) => {
      this.loading = false;

      if (err.status === 404) {
        this.errorMessage = 'No se encontraron equipos para este año. Probá con otro.';
      } else {
        this.errorMessage = 'Ocurrió un error al cargar los equipos.';
      }

      console.error('Error al cargar equipos:', err);
    }
  });
}


  selectTeam(team: any): void {
  this.selectedTeam = team;
  this.teamDrivers = [];
  this.loading = true;

  this.f1Api.getDrivers(this.selectedYear).subscribe({
    next: (res) => {
      this.teamDrivers = (res.drivers ?? []).filter(
        (d: any) => d.teamId === team.teamId
      );
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar pilotos:', err);
      this.loading = false;
    }
  });
}

  generateYears(start: number, end: number): void {
  this.availableYears = Array.from({ length: end - start + 1 }, (_, i) => end - i);
}
}
