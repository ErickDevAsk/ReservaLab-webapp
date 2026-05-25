import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz para los datos del Admin
export interface AdminDashboardData {
  totalUsuarios: number;
  tecnicosActivos: number;
  laboratoriosRed: number;
  reservasHoy: number;
  datosEstado: any[];
  datosTendencia: any[];
}

// Interfaz para los datos del Técnico
export interface TecnicoDashboardData {
  alertas_danos: any[];
  devoluciones_pendientes: any[];
  ocupacion_semanal: any[];
  tendencia_reservas: any[];
  reservas_hoy: number;
  equipos_disponibles: number;
  total_devoluciones: number;
  equipos_mantenimiento: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Separamos las URLs para tener ambas a la mano
  private adminUrl = `${environment.apiUrl}dashboard/admin/`;
  private tecnicoUrl = `${environment.apiUrl}dashboard/tecnico/`;
  private reportesUrl = `${environment.apiUrl}dashboard/tecnico/reportes/`;

  constructor(private http: HttpClient) {}

  // Petición original del Admin
  getAdminDashboard(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(this.adminUrl);
  }

  // 🔥 NUEVO: Petición para el Dashboard del Técnico
  getTecnicoDashboard(): Observable<TecnicoDashboardData> {
    return this.http.get<TecnicoDashboardData>(this.tecnicoUrl);
  }

  getReportesTecnico(): Observable<any> {
    return this.http.get<any>(this.reportesUrl);
  }
}

