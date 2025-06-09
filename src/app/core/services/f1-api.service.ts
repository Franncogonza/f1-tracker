import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Import 'map' operator
import { Team, TeamsResponse, Driver, DriversResponse, ChampionshipDriver, DriversChampionshipResponse, ChampionshipConstructor, ConstructorsChampionshipResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  getTeams(year: number): Observable<Team[]> {
    return this.http.get<TeamsResponse>(`${this.baseUrl}/${year}/teams`).pipe(
      map(response => response.teams), // Extract the 'teams' array
      catchError(this.handleError)
    );
  }

  getDrivers(year: number): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/${year}/drivers`).pipe(
      map(response => response.drivers), // Extract the 'drivers' array
      catchError(this.handleError)
    );
  }

  getAllDrivers(limit = 1000, offset = 0): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers?limit=${limit}&offset=${offset}`).pipe(
      map(response => response.drivers),
      catchError(this.handleError)
    );
  }

  searchDrivers(query: string): Observable<Driver[]> {
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => response.drivers),
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
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}