import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

// Interfaz que modela la actividad reciente del técnico
export interface ActividadTecnico {
  id: number;
  tipo: 'aprobacion' | 'rechazo' | 'devolucion' | 'incidencia';
  descripcion: string;
  fecha: string;
  usuario?: string;
  equipo?: string;
}

// Interfaz del perfil completo del técnico
export interface PerfilTecnico {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  matricula_id: string;
  carrera_departamento: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class TecnicoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/accounts';

  // Signals de estado
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  /**
   Obtiene el perfil del usuario autenticado (técnico).
   El interceptor inyecta el token automáticamente.
   */
  getMiPerfil() {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<PerfilTecnico>(`${this.API_URL}/me/`).pipe(
      catchError((err) => {
        const mensaje =
          err.status === 401
            ? 'Sesión expirada. Por favor inicia sesión de nuevo.'
            : 'No se pudo cargar el perfil. Verifica la conexión.';
        this.error.set(mensaje);
        console.error('Error al obtener perfil del técnico:', err);
        // Retornamos datos mock mientras el endpoint /me/ esté disponible
        return of(this.getMockPerfil());
      }),
      finalize(() => this.loading.set(false))
    );
  }

   //Obtiene el historial de actividades recientes del técnico.
  getActividadReciente() {
    return this.http
      .get<ActividadTecnico[]>(`${this.API_URL}/actividad/`)
      .pipe(catchError(() => of(this.getMockActividad())));
  }

  // Mock del perfil mientras el endpoint está en desarrollo
  private getMockPerfil(): PerfilTecnico {
    return {
      id: 1,
      username: 'tecnico',
      first_name: 'Carlos',
      last_name: 'Ramírez López',
      email: 'c.ramirez@buap.mx',
      matricula_id: '20241056',
      carrera_departamento: 'Soporte Técnico - FCC',
      rol: 'tecnico',
    };
  }

  // Mock del historial mientras el endpoint está en desarrollo
  private getMockActividad(): ActividadTecnico[] {
    return [
      {
        id: 1,
        tipo: 'aprobacion',
        descripcion: 'Reserva de Laboratorio de Física aprobada',
        fecha: '2026-04-15T10:30:00',
        usuario: 'Christian M.',
        equipo: 'Microscopio Óptico',
      },
      {
        id: 2,
        tipo: 'devolucion',
        descripcion: 'Devolución de Osciloscopio registrada',
        fecha: '2026-04-15T09:15:00',
        usuario: 'Ana García',
        equipo: 'Osciloscopio Digital',
      },
      {
        id: 3,
        tipo: 'rechazo',
        descripcion: 'Reserva rechazada por conflicto de horario',
        fecha: '2026-04-14T16:45:00',
        usuario: 'Roberto Silva',
      },
      {
        id: 4,
        tipo: 'incidencia',
        descripcion: 'Incidencia reportada: Espectrofotómetro UV dañado',
        fecha: '2026-04-14T11:20:00',
        equipo: 'Espectrofotómetro UV',
      },
      {
        id: 5,
        tipo: 'aprobacion',
        descripcion: 'Reserva de Laboratorio de Química aprobada',
        fecha: '2026-04-13T14:00:00',
        usuario: 'María González',
      },
    ];
  }
}