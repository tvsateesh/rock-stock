import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  template: `<canvas #canvas></canvas>`
})
export class ChartComponent implements OnChanges {
  @Input() historical: any;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.historical && this.historical) {
      this.renderChart();
    }
  }

  renderChart() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const timestamps = this.historical?.chart?.result?.[0]?.timestamp || [];
    const closes = this.historical?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps.map((t: number) => new Date(t * 1000).toLocaleDateString()),
        datasets: [
          {
            label: 'Close',
            data: closes,
            borderColor: 'rgba(33,150,243,0.9)',
            backgroundColor: 'rgba(33,150,243,0.2)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { display: true }, y: { display: true } }
      }
    });

    // make canvas responsive height
    this.canvas.nativeElement.style.width = '100%';
    this.canvas.nativeElement.style.height = '240px';
  }
}
