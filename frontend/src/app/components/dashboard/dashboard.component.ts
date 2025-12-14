import { Component } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { forkJoin, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container">
      <app-search-bar (choose)="onChoose($event)"></app-search-bar>

      <div class="grid" *ngIf="tracked.length">
        <div *ngFor="let s of tracked">
          <mat-card>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <h3>{{ s }}</h3>
              <button mat-icon-button (click)="remove(s)" class="close-btn"><mat-icon>x</mat-icon></button>
            </div>
            <app-quote-card [quote]="quotes[s]"></app-quote-card>
            <app-chart [historical]="historicals[s]"></app-chart>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .close-btn {
      color: #d32f2f;
      font-weight: bold;
    }
    .close-btn:hover {
      background-color: rgba(211, 47, 47, 0.1);
    }
  `]
})
export class DashboardComponent {
  tracked: string[] = [];
  quotes: Record<string, any> = {};
  historicals: Record<string, any> = {};

  constructor(private api: StockApiService) {
    console.log('[DashboardComponent] Initialized');
    // polling to refresh quotes periodically
    timer(0, environment.pollingIntervalMs)
      .pipe(switchMap(() => forkJoin([])))
      .subscribe();
  }

  onChoose(symbol: string) {
    console.log('[DashboardComponent] onChoose called with symbol:', symbol);
    if (!this.tracked.includes(symbol)) {
      this.tracked.push(symbol);
      console.log('[DashboardComponent] Added symbol to tracked:', this.tracked);
    }

    // Fetch quote
    this.api.quote(symbol).subscribe({
      next: (q: any) => {
        console.log('[DashboardComponent] Quote received for', symbol, ':', q);
        this.quotes[symbol] = q;
      },
      error: (err: any) => {
        console.error('[DashboardComponent] Quote failed for', symbol, ':', err);
      }
    });

    // Fetch historical
    this.api.historical(symbol, '1mo', '1d').subscribe({
      next: (h: any) => {
        console.log('[DashboardComponent] Historical received for', symbol, ':', h);
        this.historicals[symbol] = h;
      },
      error: (err: any) => {
        console.error('[DashboardComponent] Historical failed for', symbol, ':', err);
      }
    });
  }

  remove(symbol: string) {
    console.log('[DashboardComponent] remove called with symbol:', symbol);
    this.tracked = this.tracked.filter(s => s !== symbol);
    delete this.quotes[symbol];
    delete this.historicals[symbol];
  }
}

