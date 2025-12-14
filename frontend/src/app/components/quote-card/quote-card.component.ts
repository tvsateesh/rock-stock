import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quote-card',
  template: `
    <mat-card *ngIf="quote">
      <h2>{{ quote?.price?.shortName || quote?.symbol }}</h2>
      <p>Price: {{ quote?.price?.regularMarketPrice?.raw ?? quote?.price?.regularMarketPrice }}</p>
      <p>Change: {{ quote?.price?.regularMarketChange?.fmt ?? quote?.price?.regularMarketChange }}</p>
      <p>%: {{ quote?.price?.regularMarketChangePercent?.fmt ?? quote?.price?.regularMarketChangePercent }}</p>
    </mat-card>
  `
})
export class QuoteCardComponent {
  @Input() quote: any;
}
