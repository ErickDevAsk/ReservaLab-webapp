import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../core/services/dashboard'; //  Importamos la librería del equipo

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NgxChartsModule], //  La agregamos aquí
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {

  // Inyecta el servicio
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes() {
    this.dashboardService.getReportesTecnico().subscribe({
      next: (data) => {
        // Actualizamos los KPIs con datos reales de la base de datos
        this.totalPrestamos.set(data.kpis.total_prestamos);
        this.nuevosUsuarios.set(data.kpis.nuevos_usuarios);
        this.tasaOcupacion.set(data.kpis.tasa_ocupacion);
        this.reservasActivas.set(data.kpis.reservas_activas);

        // Actualizamos las gráficas
        this.pieChartData.set(data.graficas.pie_chart);
        this.barChartData.set(data.graficas.bar_chart);
        this.lineChartData.set(data.graficas.line_chart);
      },
      error: (err) => console.error('Error al cargar reportes:', err)
    });
  }

  // --- 1. Signals para las tarjetas superiores (KPIs) ---
  totalPrestamos = signal<number>(1248);
  nuevosUsuarios = signal<number>(84);
  tasaOcupacion = signal<number>(78);
  reservasActivas = signal<number>(42);

  // --- 2. Signals para las gráficas (Formato ngx-charts) ---

  // Gráfica de Barras Agrupadas
  barChartData = signal<any[]>([
    {
      name: 'Lun',
      series: [{ name: '% Ocupación', value: 65 }, { name: 'Reservas', value: 40 }]
    },
    {
      name: 'Mar',
      series: [{ name: '% Ocupación', value: 85 }, { name: 'Reservas', value: 55 }]
    },
    {
      name: 'Mié',
      series: [{ name: '% Ocupación', value: 75 }, { name: 'Reservas', value: 48 }]
    },
    {
      name: 'Jue',
      series: [{ name: '% Ocupación', value: 90 }, { name: 'Reservas', value: 60 }]
    },
    {
      name: 'Vie',
      series: [{ name: '% Ocupación', value: 60 }, { name: 'Reservas', value: 35 }]
    }
  ]);

  // Gráfica de Dona
  pieChartData = signal<any[]>([
    { name: 'Electrónica', value: 30 },
    { name: 'Biología', value: 25 },
    { name: 'Física', value: 20 },
    { name: 'Química', value: 25 }
  ]);

  // Gráfica de Línea
  lineChartData = signal<any[]>([
    {
      name: 'Uso mensual',
      series: [
        { name: 'Lun', value: 65 },
        { name: 'Mar', value: 85 },
        { name: 'Mié', value: 75 },
        { name: 'Jue', value: 90 },
        { name: 'Vie', value: 60 },
        { name: 'Sáb', value: 30 }
      ]
    }
  ]);

  // --- 3. Paletas de Colores ---
  colorBarras: any = { domain: ['#2563EB', '#93C5FD'] };
  colorDona: any = { domain: ['#2563EB', '#7C3AED', '#EC4899', '#F97316'] };
  colorLinea: any = { domain: ['#2563EB'] };


}
