import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard';
import { EquipoService } from '../../../core/services/equipo';
import { NotificationService } from '../../../core/services/notification';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-tecnico-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  // styleUrls: ...
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private equipoService = inject(EquipoService);
  private notifService = inject(NotificationService);

  alertasDanos = signal<any[]>([]);

  // Signals para las gráficas
  ocupacionData = signal<any[]>([]);
  tendenciaData = signal<any[]>([]);

  //  Colores para que se vean igual a tu diseño
  colorBarras: any = { domain: ['#3b82f6'] }; // Azul
  colorLinea: any = { domain: ['#10b981'] }; // Verde/Esmeralda

  //  Signals listos para conectarse (inician en 0 por ahora)
  reservasHoy = signal<number>(0);
  equiposDisponibles = signal<number>(0);
  devolucionesPendientes = signal<number>(0);
  equiposMantenimiento = signal<number>(0);

  // Para la tabla de devoluciones
  devoluciones = signal<any[]>([]);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.dashboardService.getTecnicoDashboard().subscribe({
      next: (data) => {
        // Conectamos la data real de incidencias
        this.alertasDanos.set(data.alertas_danos || []);

        // 2. Conectamos la data real de las devoluciones
        this.devoluciones.set(data.devoluciones_pendientes || []);

        // Guardamos los datos de las gráficas
        this.ocupacionData.set(data.ocupacion_semanal || []);
        this.tendenciaData.set(data.tendencia_reservas || []);

        // CONTADORES SUPERIORES
        this.reservasHoy.set(data.reservas_hoy || 0);
        this.equiposDisponibles.set(data.equipos_disponibles || 0);
        this.devolucionesPendientes.set(data.total_devoluciones || 0);
        this.equiposMantenimiento.set(data.equipos_mantenimiento || 0);
      },
      error: (err) => console.error('Error al cargar dashboard:', err)
    });
  }

  liberarEquipo(idIncidencia: number) {
    this.equipoService.resolverIncidencia(idIncidencia).subscribe({
      next: () => {
        // Notificamos éxito
        this.notifService.exito('El equipo ha sido reparado y devuelto al inventario.');
        // Recargamos el dashboard para que la tarjeta roja desaparezca mágicamente
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        this.notifService.error('Error al intentar liberar el equipo.');
      }
    });
  }
}
