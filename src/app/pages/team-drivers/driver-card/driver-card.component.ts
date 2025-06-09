import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../../core/models/models';
import { GetFlagPipe } from '../../../core/pipes/get-flag.pipe';

@Component({
  selector: 'app-driver-card',
  standalone: true,
  imports: [CommonModule, GetFlagPipe],
  template: `
    <div class="driver-card">
      <div class="driver-name">{{ driver.name }} {{ driver.surname }}</div>
      <p><strong>Nacionalidad:</strong> {{ driver.nationality | getFlag }} {{ driver.nationality }}</p>
      <p><strong>🎂 Nacimiento:</strong> {{ driver.birthday }}</p>
      <p *ngIf="driver.number"><strong>🚗 Número:</strong> {{ driver.number }}</p>
      <a [href]="driver.url" target="_blank" rel="noopener noreferrer">🌐 Ver en Wikipedia</a>
    </div>
  `,
  styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent {
  @Input({ required: true }) driver!: Driver;
}
