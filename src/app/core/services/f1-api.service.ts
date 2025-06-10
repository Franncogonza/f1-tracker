import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Team, TeamsResponse, Driver, DriversResponse, ChampionshipDriver, DriversChampionshipResponse, ChampionshipConstructor, ConstructorsChampionshipResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  private mapDrivers(drivers: Driver[]): Driver[] {
    return drivers.map(driver => ({
      ...driver,
      birthday: this.parseDate(driver.birthday)
    }));
  }

  private mapTeams(teams: Team[]): Team[] {
    // Si algún día Team tiene fecha, parseala acá
    return teams.map(team => ({
      ...team,
      // foundationDate: this.parseDate(team.foundationDate) // ejemplo si existiera
    }));
  }

  getTeams(year: number): Observable<Team[]> {
    return this.http.get<TeamsResponse>(`${this.baseUrl}/${year}/teams`).pipe(
      map(response => this.mapTeams(response.teams)),
      catchError(this.handleError)
    );
  }

  getDrivers(year: number): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/${year}/drivers`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      catchError(this.handleError)
    );
  }

  getAllDrivers(limit = 1000, offset = 0): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers?limit=${limit}&offset=${offset}`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      catchError(this.handleError)
    );
  }

  searchDrivers(query: string): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      catchError(this.handleError)
    );
  }

  getTopDriversByYear(year: number): Observable<ChampionshipDriver[]> {
    return this.http.get<DriversChampionshipResponse>(`${this.baseUrl}/${year}/drivers-championship`).pipe(
      map(response => response.drivers_championship),
      catchError(this.handleError)
    );
  }

  getTopConstructorsByYear(year: number): Observable<ChampionshipConstructor[]> {
    return this.http.get<ConstructorsChampionshipResponse>(`${this.baseUrl}/${year}/constructors-championship`).pipe(
      map(response => response.constructors_championship),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

    // --- Utilidad interna ---
  private parseDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(value);
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [dd, mm, yyyy] = value.split('/');
        return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      }
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  }

}
