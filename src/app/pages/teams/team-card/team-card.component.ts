import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Team } from '../../../core/models/models';
import { GetFlagPipe } from '../../../core/pipes/get-flag.pipe';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, GetFlagPipe],
  template: `
    <nz-card
      class="team-card"
      [nzTitle]="team.teamName"
      class="team-card"
      [nzBordered]="false"
      [nzHoverable]="true"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      style="width: 100%; cursor: pointer;"
      tabindex="0"
    >
      <p><strong>Origen:</strong> {{ team.teamNationality | getFlag }}</p>
      <p><strong>🚦 Debut:</strong> {{ team.firstAppeareance }}</p>
      <p><strong>🏆 Constructores:</strong> {{ team.constructorsChampionships ?? '0' }}</p>
      <p><strong>🏁 Pilotos:</strong> {{ team.driversChampionships ?? '0' }}</p>
      <a [href]="team.url" target="_blank" rel="noopener noreferrer">
        🌐 Ver en Wikipedia
      </a>
    </nz-card>
  `,
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Output() selectTeam = new EventEmitter<Team>();

  onCardClick(): void {
    this.selectTeam.emit(this.team);
  }
}

