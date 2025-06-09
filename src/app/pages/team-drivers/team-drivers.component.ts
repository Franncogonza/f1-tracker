import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { F1ApiService } from '../../core/services/f1-api.service';

@Component({
  selector: 'app-team-drivers',
  standalone: true,
  imports: [CommonModule, NzSpinModule, NzAlertModule],
  templateUrl: './team-drivers.component.html',
  styleUrls: ['./team-drivers.component.scss']
})
export class TeamDriversComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly f1Api = inject(F1ApiService);
  private readonly location = inject(Location);
  teamId!: string;
  year!: number;
  teamName: string = '';
  drivers: any[] = [];
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
      next: (res) => {
        const allDrivers = res.drivers ?? [];
        this.drivers = allDrivers.filter((d: any) => d.teamId === this.teamId);
        this.teamName = this.drivers[0]?.teamName || this.teamId;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los pilotos del equipo';
        this.loading = false;
      }
    });
  }

  getFlag(nationality: string): string {
  const flags: { [key: string]: string } = {
    'Australia': '🇦🇺',
    'Great Britain': '🇬🇧',
    'Netherlands': '🇳🇱',
    'Germany': '🇩🇪',
    'Monaco': '🇲🇨',
    'Italian': '🇮🇹',
    'Thailand': '🇹🇭',
    'France': '🇫🇷',
    'Canada': '🇨🇦',
    'Spain': '🇪🇸',
    'Japan': '🇯🇵',
    'New Zealander': '🇳🇿',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Argentine': '🇦🇷',
    'default': '🏁'
  };
  return flags[nationality] || flags['default'];
}

   goBack(): void {
    this.location.back();
  }

}
