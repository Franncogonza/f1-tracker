import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { F1ApiService } from '../../core/services/f1-api.service';
import { Team } from '../../core/models/models';
import { generateYears } from '../../core/utils/generate-years';
import { TeamCardComponent } from './team-card/team-card.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSpinModule,
    NzCardModule,
    NzSelectModule,
    NzAlertModule,
    NzPaginationModule,
    TeamCardComponent
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  loading = false;
  availableYears: number[] = [];
  selectedYear = 2025;
  errorMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 6;

  private readonly f1Api = inject(F1ApiService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroy$ = new Subject<void>(); private readonly teamHandlers = new Map<string, () => void>();

  ngOnInit(): void {
    this.availableYears = generateYears(1950, 2025);
    this.fetchTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onYearChange(): void {
    this.errorMessage = null;
    this.currentPage = 1;
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.loading = true;
    this.errorMessage = null;

    this.f1Api.getTeams(this.selectedYear)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (teams: Team[]) => {
          this.teams = teams ?? [];

          if (this.teams.length === 0) {
            this.errorMessage = 'No se encontraron equipos para este año. Probá con otro.';
          }
        },
        error: (err: any) => {
          this.errorMessage = err?.status === 404
            ? 'No se encontraron equipos para este año. Probá con otro.'
            : 'Ocurrió un error al cargar los equipos.';
          console.error('Error al cargar equipos:', err);
        }
      });
  }

  selectTeam(team: Team): void {
    this.router.navigate(['/teams', team.teamId, 'drivers', this.selectedYear]);
  }

  onTeamCardSelect(team: Team): void {
    this.selectTeam(team);
  }

  goBack(): void {
    this.location.back();
  }

  trackByTeamId(_: number, team: Team): string {
    return team.teamId;
  }

  get paginatedTeams(): Team[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.teams.slice(start, start + this.itemsPerPage);
  }

}
