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

  getAllDrivers(limit = 1000, offset = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/drivers?limit=${limit}&offset=${offset}`);
  }

  searchDrivers(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/drivers/search?q=${encodeURIComponent(query)}`);
  }

  getTopDriversByYear(year: number): Observable<any> {
    return this.http.get(`https://f1api.dev/api/${year}/drivers-championship`);
  }

  getTopConstructorsByYear(year: number): Observable<any> {
    return this.http.get(`https://f1api.dev/api/${year}/constructors-championship`);
  }
}
