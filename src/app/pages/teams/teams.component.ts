import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// NG-ZORRO Modules
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { Router } from '@angular/router';

import { F1ApiService } from '../../core/services/f1-api.service';
import { Team } from '../../core/models/models';
import { generateYears } from '../../core/utils/generate-years';
import { TeamCardComponent } from './team-card/team-card.component';
import { AppButtonComponent } from '../../shared/button/button.component';

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
    NzEmptyModule,
    TeamCardComponent,
    AppButtonComponent
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  private readonly f1Api = inject(F1ApiService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroy$ = new Subject<void>();

  isLoadingTeams$: Observable<boolean> = this.f1Api.isLoadingTeams$;

  ngOnInit(): void {
    this.availableYears = generateYears(1950, new Date().getFullYear() + 1);
    this.fetchTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onYearChange(): void {
    this.currentPage = 1;
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.f1Api.getTeams(this.selectedYear)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (teams: Team[]) => {
          this.teams = teams ?? [];
        },
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

  onPageIndexChange(index: number): void {
    this.currentPage = index;
  }
}