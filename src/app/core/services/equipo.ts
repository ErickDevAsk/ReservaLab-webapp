import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface Equipo {
  id?: number;                    // opcional para crear
  nombre: string;
  descripcion?: string;
  numero_inventario: string;
  cantidad_total: number;
  cantidad_disponible: number;
  estado: 'Disponible' | 'En Uso' | 'Mantenimiento' | 'Dañado' | string;
  laboratorio?: number | null;
  laboratorio_nombre?: string;    // solo para mostrar en tabla
}

export type EquipoPayload = Omit<Equipo, 'id' | 'laboratorio_nombre'>;

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/equipos/';

  public loading = signal<boolean>(false);

  getEquipos(): Observable<Equipo[]> {
    this.loading.set(true);
    return this.http.get<Equipo[]>(this.API_URL).pipe(
      catchError((err) => {
        console.warn('Backend no disponible, usando mock:', err.message);
        return of(this.getMockEquipos());
      })
    );
  }

  getEquiposDisponibles(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.API_URL}?estado=Disponible`).pipe(
      catchError(() => of(this.getMockEquipos().filter(eq => eq.cantidad_disponible > 0)))
    );
  }

  crearEquipo(payload: EquipoPayload): Observable<Equipo> {
    return this.http.post<Equipo>(this.API_URL, payload);
  }

  actualizarEquipo(id: number, payload: EquipoPayload): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.API_URL}${id}/`, payload);
  }

  eliminarEquipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }
  /**
   Datos mock como fallback mientras el endpoint de inventario
   es implementado por el equipo de backend.
   */
  private getMockEquipos(): Equipo[] {
    return [
      {
        id: 1,
        nombre: 'Microscopio Óptico',
        descripcion: 'Microscopio binocular de alta resolución',
        numero_inventario: 'MIC-001',
        cantidad_total: 10,
        cantidad_disponible: 8,
        estado: 'Disponible',
        laboratorio: 1,
      },
      {
        id: 2,
        nombre: 'Osciloscopio Digital',
        descripcion: 'Osciloscopio de 4 canales 100MHz',
        numero_inventario: 'OSC-001',
        cantidad_total: 5,
        cantidad_disponible: 3,
        estado: 'Disponible',
        laboratorio: 2,
      },
      {
        id: 3,
        nombre: 'Multímetro Digital',
        descripcion: 'Multímetro True RMS con interfaz serial',
        numero_inventario: 'MUL-042',
        cantidad_total: 15,
        cantidad_disponible: 12,
        estado: 'Disponible',
        laboratorio: null,
      },
      {
        id: 4,
        nombre: 'Centrifugadora',
        descripcion: 'Centrifugadora de mesa 12,000 RPM',
        numero_inventario: 'CEN-008',
        cantidad_total: 3,
        cantidad_disponible: 1,
        estado: 'Disponible',
        laboratorio: 1,
      },
      {
        id: 5,
        nombre: 'Espectrofotómetro UV',
        descripcion: 'Espectrofotómetro UV-Vis doble haz',
        numero_inventario: 'ESP-001',
        cantidad_total: 3,
        cantidad_disponible: 0,
        estado: 'Mantenimiento',
        laboratorio: 1,
      },
      {
        id: 6,
        nombre: 'Balanza Analítica',
        descripcion: 'Balanza analítica 0.0001g de precisión',
        numero_inventario: 'BAL-023',
        cantidad_total: 6,
        cantidad_disponible: 5,
        estado: 'Disponible',
        laboratorio: 2,
      },
    ];
  }
}
