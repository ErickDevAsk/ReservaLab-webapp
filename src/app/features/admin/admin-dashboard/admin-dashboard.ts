import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../core/services/dashboard';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  posicionLeyenda = LegendPosition.Right;

  // -- Contadores Superiores --
  totalUsuarios = 0;
  tecnicosActivos = 0;
  laboratoriosRed = 0;
  reservasHoy = 0;

  // -- Configuración de Colores --
  colorSchemeLinea: any = {
    domain: ['#10B981']
  };

  colorSchemePastel: any = {
    domain: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981']
  };

  // -- Datos para las Gráficas --
  datosTendencia: any[] = [];
  datosEstado: any[] = [];

  // Inyectamos el servicio aquí
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    // Nos suscribimos a la respuesta de Django
    this.dashboardService.getAdminDashboard().subscribe({
      next: (data: any) => {
        // 1. Llenamos los contadores
        this.totalUsuarios = data.totalUsuarios;
        this.tecnicosActivos = data.tecnicosActivos;
        this.laboratoriosRed = data.laboratoriosRed;
        this.reservasHoy = data.reservasHoy;

        // 2. Llenamos las gráficas
        // MUY IMPORTANTE: Usamos el operador spread [...] para que
        // ngx-charts detecte el cambio y haga la animación correctamente.
        this.datosEstado = [...data.datosEstado];
        this.datosTendencia = [...data.datosTendencia];
      },
      error: (error: any) => {
        console.error('Error al obtener los datos del Dashboard:', error);
      }
    });
  }
}
