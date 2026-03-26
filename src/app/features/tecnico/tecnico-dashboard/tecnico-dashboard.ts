import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-tecnico-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tecnico-dashboard.html',
  styleUrl: './tecnico-dashboard.scss',
})
export class TecnicoDashboard implements AfterViewInit {

  ngAfterViewInit(): void {

    const ocupacionCtx = document.getElementById('ocupacionChart') as HTMLCanvasElement;

    if (ocupacionCtx) {
      new Chart(ocupacionCtx, {
        type: 'bar',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Ocupación (%)',
            data: [75, 82, 68, 90, 85, 45, 30],
            backgroundColor: '#3B82F6'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    const reservasCtx = document.getElementById('reservasChart') as HTMLCanvasElement;

    if (reservasCtx) {
      new Chart(reservasCtx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Reservas',
            data: [20, 35, 40, 50, 65, 80],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16,185,129,0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true
        }
      });
    }

  }

}