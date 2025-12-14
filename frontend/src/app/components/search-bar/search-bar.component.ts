import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { StockApiService } from '../../services/stock-api.service';

@Component({
  selector: 'app-search-bar',
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span class="toolbar-title">Rock Stock</span>
      <span class="spacer"></span>
      <div class="search-wrapper">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search symbol or company</mat-label>
          <input matInput [formControl]="control" />
        </mat-form-field>
        <div class="search-results-dropdown" *ngIf="results?.length">
          <mat-list>
            <mat-list-item *ngFor="let r of results; let i = index" (click)="select(r.symbol)" class="result-item">
              <strong matListItemTitle>{{ r.symbol }}</strong>
              <p matListItemLine>{{ r.shortname || r.name }}</p>
            </mat-list-item>
          </mat-list>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      height: 64px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .toolbar-title {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .search-wrapper {
      position: relative;
      margin-left: 1rem;
      margin-top: 20px;
      display: flex;
      align-items: center;
      height: 100%;
      color: white;
    }
    .search-field {
      width: 340px;
      margin: 0;
    }
    .search-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      display: none;
    }
    .search-field ::ng-deep .mat-mdc-form-field-infix {
      color: white;
    }
    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      padding-bottom: 0;
    }
    .search-field ::ng-deep .mdc-notched-outline__leading,
    .search-field ::ng-deep .mdc-notched-outline__notch,
    .search-field ::ng-deep .mdc-notched-outline__trailing {
      border-color: white !important;
    }
    .search-field ::ng-deep .mat-mdc-form-field-label {
      color: white !important;
    }
    .search-field ::ng-deep .mat-mdc-form-field-label-wrapper {
      color: white !important;
    }
    .search-field ::ng-deep .mdc-floating-label {
      color: white !important;
    }
    .search-field ::ng-deep .mdc-floating-label--float-above {
      color: white !important;
    }
    .search-field ::ng-deep input::placeholder {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    .search-field ::ng-deep input {
      color: white !important;
      caret-color: white;
    }
    .search-field ::ng-deep .mdc-text-field__input {
      color: white !important;
      caret-color: white;
    }
    .search-results-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      max-height: 400px;
      overflow-y: auto;
      margin-top: 8px;
      z-index: 1000;
      min-width: 340px;
    }
    mat-list {
      padding: 0 !important;
    }
    .result-item {
      padding: 12px 16px !important;
      cursor: pointer;
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.2s ease;
      height: auto !important;
    }
    .result-item:hover {
      background-color: #f5f5f5;
    }
    .result-item:last-child {
      border-bottom: none;
    }
    .result-item strong {
      color: #1976d2;
      font-weight: 600;
      display: block;
    }
    .result-item p {
      color: #666;
      font-size: 0.875rem;
      margin: 4px 0 0 0;
      display: block;
    }
  `]
})
export class SearchBarComponent {
  control = new FormControl('');
  results: any[] = [];
  @Output() choose = new EventEmitter<string>();

  constructor(private api: StockApiService) {
    console.log('[SearchBarComponent] Initialized');
    this.control.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(q => {
          if (!q || q.trim().length === 0) {
            this.results = [];
            return [];
          }
          return this.api.search(q || '');
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('[SearchBarComponent] Search results:', res);
          this.results = res?.quotes || res?.items || [];
        },
        error: (err: any) => {
          console.error('[SearchBarComponent] Search error:', err);
          this.results = [];
        }
      });
  }

  select(symbol: string) {
    console.log('[SearchBarComponent] select called with symbol:', symbol);
    this.choose.emit(symbol);
    this.results = [];
    this.control.setValue('');
  }
}
