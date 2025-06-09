import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { F1ApiService } from '../../core/services/f1-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSpinModule,
    NzCardModule,
    NzSelectModule,
    NzSpinModule,
    NzAlertModule,
    NzPaginationModule
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  selectedTeam: any = null;
  teamDrivers: any[] = [];
  loading = false;

  availableYears: number[] = [];
  selectedYear = 2025;
  errorMessage: string | null = null;

  //services
  private readonly f1Api = inject(F1ApiService);
  private readonly router = inject(Router);


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
  this.router.navigate(['/teams', team.teamId, 'drivers', this.selectedYear]);

}

  generateYears(start: number, end: number): void {
    this.availableYears = Array.from({ length: end - start + 1 }, (_, i) => end - i);
  }

//pagination
currentPage = 1;
itemsPerPage = 6;

get paginatedTeams(): any[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.teams.slice(start, start + this.itemsPerPage);
}
}
