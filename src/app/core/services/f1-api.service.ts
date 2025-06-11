import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, finalize, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Team, TeamsResponse, Driver, DriversResponse, ChampionshipDriver, DriversChampionshipResponse, ChampionshipConstructor, ConstructorsChampionshipResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  // Transfer state
  private readonly state = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

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
    return this.fetchWithTransferState(
      `teams-${year}`,
      () => this.http.get<TeamsResponse>(`${this.baseUrl}/${year}/teams`).pipe(
        map(res => this.mapTeams(res.teams))
      ),
      this._isLoadingTeams
    );
  }

  getDrivers(year: number): Observable<Driver[]> {
    return this.fetchWithTransferState(
      `drivers-${year}`,
      () => this.http.get<DriversResponse>(`${this.baseUrl}/${year}/drivers`).pipe(
        map(res => this.mapDrivers(res.drivers))
      ),
      this._isLoadingDrivers
    );
  }

  getAllDrivers(limit = 1000, offset = 0): Observable<Driver[]> {
    return this.fetchWithTransferState(
      `drivers-all-${limit}-${offset}`,
      () => this.http.get<DriversResponse>(`${this.baseUrl}/drivers?limit=${limit}&offset=${offset}`).pipe(
        map(response => this.mapDrivers(response.drivers))
      ),
      this._isLoadingDrivers
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
    return this.fetchWithTransferState(
      `drivers-championship-${year}`,
      () => this.http.get<DriversChampionshipResponse>(`${this.baseUrl}/${year}/drivers-championship`).pipe(
        map(res => res.drivers_championship)
      ),
      this._isLoadingChampionshipDrivers
    );
  }

  getTopConstructorsByYear(year: number): Observable<ChampionshipConstructor[]> {
    // Reutilizo la función genérica 'fetchWithTransferState'
    return this.fetchWithTransferState(
      `constructors-championship-${year}`,
      () => this.http.get<ConstructorsChampionshipResponse>(`${this.baseUrl}/${year}/constructors-championship`).pipe(
        map(response => response.constructors_championship)
      ),
      this._isLoadingChampionshipConstructors
    );
  }

  // --- Utilidad interna ---
  private mapDrivers(drivers: Driver[]): Driver[] {
    return drivers.map(driver => ({
      ...driver,
      birthday: driver.birthday ? this.parseDate(driver.birthday) : null
    }));
  }

  private mapTeams(teams: Team[]): Team[] {
    return teams.map(team => ({
      ...team,
    }));
  }

  private parseDate(value: string | Date): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      // Formato YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(value + 'T00:00:00'); // Añadir T00:00:00 para evitar problemas de zona horaria
      }
      // Formato DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [dd, mm, yyyy] = value.split('/');
        return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      }
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  }

  /**
   * Función genérica para manejar la obtención de datos con TransferState,
   * estados de carga y manejo de errores.
   * @param keyName El nombre clave para el TransferState.
   * @param fetchFn Una función que devuelve un Observable de los datos a obtener.
   * @param setLoading Un BehaviorSubject opcional para manejar el estado de carga.
   */
  private fetchWithTransferState<T>(
    keyName: string,
    fetchFn: () => Observable<T>,
    setLoading?: BehaviorSubject<boolean>
  ): Observable<T> {
    const key = makeStateKey<T>(keyName);
    const cached = this.state.get(key, undefined);

    if (cached) {
      console.log(`Cache hit for ${keyName}`);
      return of(cached);
    }

    setLoading?.next(true);
    return fetchFn().pipe(
      tap(data => {
        if (isPlatformServer(this.platformId)) {
          console.log(`Setting TransferState for ${keyName}`);
          this.state.set(key, data);
        }
      }),
      finalize(() => setLoading?.next(false)),
      catchError(err => {
        console.error(`Error fetching ${keyName} in F1ApiService:`, err);
        return of(Array.isArray(err) ? [] as T : null as T);
      })
    );
  }
}