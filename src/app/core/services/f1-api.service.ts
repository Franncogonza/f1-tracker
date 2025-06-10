import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, finalize, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Team, TeamsResponse, Driver, DriversResponse, ChampionshipDriver, DriversChampionshipResponse, ChampionshipConstructor, ConstructorsChampionshipResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  // --- Estados de carga ---
  private readonly _isLoadingTeams = new BehaviorSubject<boolean>(false);
  isLoadingTeams$ = this._isLoadingTeams.asObservable();

  private readonly _isLoadingDrivers = new BehaviorSubject<boolean>(false);
  isLoadingDrivers$ = this._isLoadingDrivers.asObservable();

  private readonly _isLoadingChampionshipDrivers = new BehaviorSubject<boolean>(false);
  isLoadingChampionshipDrivers$ = this._isLoadingChampionshipDrivers.asObservable();

  private readonly _isLoadingChampionshipConstructors = new BehaviorSubject<boolean>(false);
  isLoadingChampionshipConstructors$ = this._isLoadingChampionshipConstructors.asObservable();


  getTeams(year: number): Observable<Team[]> {
    this._isLoadingTeams.next(true);
    return this.http.get<TeamsResponse>(`${this.baseUrl}/${year}/teams`).pipe(
      map(response => this.mapTeams(response.teams)),
      finalize(() => this._isLoadingTeams.next(false)),
      catchError(err => {
        console.error('Error fetching teams in F1ApiService:', err);
        return of([]);
      })
    );
  }

  getDrivers(year: number): Observable<Driver[]> {
    this._isLoadingDrivers.next(true);
    return this.http.get<DriversResponse>(`${this.baseUrl}/${year}/drivers`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      finalize(() => this._isLoadingDrivers.next(false)),
      catchError(err => {
        console.error('Error fetching drivers in F1ApiService:', err);
        return of([]);
      })
    );
  }

  getAllDrivers(limit = 1000, offset = 0): Observable<Driver[]> {
    this._isLoadingDrivers.next(true);
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers?limit=${limit}&offset=${offset}`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      finalize(() => this._isLoadingDrivers.next(false)),
      catchError(err => {
        console.error('Error fetching all drivers in F1ApiService:', err);
        return of([]);
      })
    );
  }

  searchDrivers(query: string): Observable<Driver[]> {
    this._isLoadingDrivers.next(true);
    return this.http.get<DriversResponse>(`${this.baseUrl}/drivers/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => this.mapDrivers(response.drivers)),
      finalize(() => this._isLoadingDrivers.next(false)),
      catchError(err => {
        console.error('Error searching drivers in F1ApiService:', err);
        return of([]);
      })
    );
  }

  getTopDriversByYear(year: number): Observable<ChampionshipDriver[]> {
    this._isLoadingChampionshipDrivers.next(true);
    return this.http.get<DriversChampionshipResponse>(`${this.baseUrl}/${year}/drivers-championship`).pipe(
      map(response => response.drivers_championship),
      finalize(() => this._isLoadingChampionshipDrivers.next(false)),
      catchError(err => {
        console.error('Error fetching top drivers in F1ApiService:', err);
        return of([]);
      })
    );
  }

  getTopConstructorsByYear(year: number): Observable<ChampionshipConstructor[]> {
    this._isLoadingChampionshipConstructors.next(true);
    return this.http.get<ConstructorsChampionshipResponse>(`${this.baseUrl}/${year}/constructors-championship`).pipe(
      map(response => response.constructors_championship),
      finalize(() => this._isLoadingChampionshipConstructors.next(false)),
      catchError(err => {
        console.error('Error fetching top constructors in F1ApiService:', err);
        return of([]);
      })
    );
  }

  // --- Utilidad interna ---
  private mapDrivers(drivers: Driver[]): Driver[] {
    return drivers.map(driver => ({
      ...driver,
      birthday: this.parseDate(driver.birthday)
    }));
  }

  private mapTeams(teams: Team[]): Team[] {
    return teams.map(team => ({
      ...team,
    }));
  }

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