import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reportes',
  standalone: true,
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements AfterViewInit {

  ngAfterViewInit(): void {

    // 📊 Gráfica barras
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;

    if (barCtx) {
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          datasets: [
            {
              label: '% Ocupación',
              data: [65, 85, 75, 90, 60, 30],
              backgroundColor: '#2563EB'
            },
            {
              label: 'Reservas',
              data: [40, 55, 48, 60, 35, 15],
              backgroundColor: '#93C5FD'
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    }

    // 🍩 Gráfica dona
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (pieCtx) {
      new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Electrónica', 'Biología', 'Física', 'Química'],
          datasets: [{
            data: [30, 25, 20, 25],
            backgroundColor: ['#2563EB', '#7C3AED', '#EC4899', '#F97316']
          }]
        }
      });
    }

    // 📈 Línea
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;

    if (lineCtx) {
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          datasets: [{
            label: 'Uso mensual',
            data: [65, 85, 75, 90, 60, 30],
            borderColor: '#2563EB',
            tension: 0.4
          }]
        }
      });
    }

  }

}