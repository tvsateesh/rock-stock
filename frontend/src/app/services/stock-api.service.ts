import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    console.log('[StockApiService] Initialized with apiBaseUrl:', this.base);
  }

  quote(symbol: string): Observable<any> {
    const params = new HttpParams().set('symbol', symbol);
    const url = `${this.base}/quote`;
    console.log(`[StockApiService] Fetching quote for ${symbol} from ${url}`);
    return this.http.get(url, { params }).pipe(
      tap(data => console.log(`[StockApiService] Quote response for ${symbol}:`, data)),
      catchError(err => {
        console.error(`[StockApiService] Quote error for ${symbol}:`, err);
        return throwError(() => err);
      })
    );
  }

  historical(symbol: string, period = '1mo', interval = '1d'): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('period', period)
      .set('interval', interval);
    const url = `${this.base}/historical`;
    console.log(`[StockApiService] Fetching historical for ${symbol} from ${url}`);
    return this.http.get(url, { params }).pipe(
      tap(data => console.log(`[StockApiService] Historical response for ${symbol}:`, data)),
      catchError(err => {
        console.error(`[StockApiService] Historical error for ${symbol}:`, err);
        return throwError(() => err);
      })
    );
  }

  search(q: string): Observable<any> {
    const params = new HttpParams().set('q', q);
    const url = `${this.base}/search`;
    console.log(`[StockApiService] Searching for "${q}" from ${url}`);
    return this.http.get(url, { params }).pipe(
      tap(data => console.log(`[StockApiService] Search response for "${q}":`, data)),
      catchError(err => {
        console.error(`[StockApiService] Search error for "${q}":`, err);
        return throwError(() => err);
      })
    );
  }
}
