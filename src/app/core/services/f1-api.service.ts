import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly baseUrl = 'https://f1api.dev/api';
  private readonly http = inject(HttpClient);

  getConstructors(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/constructors`);
  }

  getDrivers(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/drivers`);
  }

  getDriversByConstructor(year: number, constructorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/constructors/${constructorId}/drivers`);
  }

  searchDrivers(year: number, query: string): Observable<any> {
    const encoded = encodeURIComponent(query);
    return this.http.get(`${this.baseUrl}/${year}/drivers/search?q=${encoded}`);
  }

  getDriverStandings(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/drivers/standings`);
  }

  getConstructorStandings(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${year}/constructors/standings`);
  }
}
