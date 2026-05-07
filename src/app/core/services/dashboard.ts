import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Esta interfaz ayuda a TypeScript a saber qué datos vienen de Django
export interface AdminDashboardData {
  totalUsuarios: number;
  tecnicosActivos: number;
  laboratoriosRed: number;
  reservasHoy: number;
  datosEstado: any[];
  datosTendencia: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Ajusta la URL a la ruta que configuraste en tu urls.py
  private apiUrl = 'http://localhost:8000/api/dashboard/admin/';

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(this.apiUrl);
  }
}
