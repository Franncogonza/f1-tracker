import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  getTeams(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/teams`);
  }

  getDrivers(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/drivers`);
  }

  getDriversByTeam(year: number, teamId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/teams/${teamId}/drivers`);
  }

  searchDrivers(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/drivers/search?q=${encodeURIComponent(query)}`);
  }

  getDriverStandings(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/drivers/standings`);
  }

  getTeamStandings(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/teams/standings`);
  }
}
