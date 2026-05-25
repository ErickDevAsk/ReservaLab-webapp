// Actualizado para Angular 16 con signals y manejo robusto de errores de Django REST Framework
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

// Interfaces de payload

export interface EquipoReservado {
  id: number;
  nombre: string;
  cantidadRequerida: number;
}

// Payload que el frontend envía al backend
export interface ReservaPayload {
  laboratorio: string;   // Nombre del laboratorio
  fecha: string;         // YYYY-MM-DD
  hora_inicio: string;   // HH:MM
  duracion: number;      // 1 a 4
  equipo: string;        // Nombres concatenados (compatibilidad backend actual)
  equipos: EquipoReservado[]; // Lista detallada para uso futuro
  proposito: string;     // Mínimo 10 caracteres
}

// Respuesta exitosa del backend de Django
export interface ReservaResponse {
  mensaje: string;
  reserva_id: number;
}

// Servicio

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private readonly http = inject(HttpClient);

  // URL base con slash final para evitar redirección 301 de Django
  private readonly API_URL = `${environment.apiUrl}reservas/`;

  //     Signals de estado público
  public loading  = signal<boolean>(false);
  public error    = signal<string | null>(null);
  public success  = signal<boolean>(false);
  // Guarda el ID de la última reserva creada exitosamente
  public ultimaReservaId = signal<number | null>(null);


  // Envía la solicitud de reserva al backend. El authInterceptor inyecta el Bearer token automáticamente.
  crearReserva(datos: ReservaPayload) {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);
    this.ultimaReservaId.set(null);

    return this.http
      .post<ReservaResponse>(`${this.API_URL}/crear/`, datos)
      .pipe(
        tap((respuesta) => {
          this.success.set(true);
          this.ultimaReservaId.set(respuesta.reserva_id);
        }),
        catchError((err) => {
          this.error.set(this.parsearErrorDjango(err));
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      );
  }


  // Verifica si el usuario tiene un token activo antes de intentar cualquier operación de reserva.
  verificarAutenticacion(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.error.set('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
      return false;
    }
    return true;
  }


  // Consulta disponibilidad de un laboratorio en una fecha específica.
  consultarDisponibilidad(lab: string, fecha: string) {
    return this.http.get<any>(`${this.API_URL}/disponibilidad/`, {
      params: { lab, fecha },
    });
  }

  // ==========================================
  //Consulta las reservas reales de un laboratorio específico
  // ==========================================
  obtenerReservasPorLaboratorio(labId: number) {
    // Esto construirá: http://localhost:8000/api/reservas/laboratorio/1/
    return this.http.get<any[]>(`${this.API_URL}/laboratorio/${labId}/`).pipe(
      catchError((err) => {
        // Aprovechamos tu excelente parseador de errores
        this.error.set(this.parsearErrorDjango(err));
        // Retornamos un array vacío para que el calendario no se rompa si hay error
        return of([]);
      })
    );
  }

  // Consulta las reservas del usuario logueado
  obtenerMisReservas() {
    // Esto construirá: http://localhost:8000/api/reservas/mis-reservas/
    // Asegúrate de que esta URL coincida con lo que el backend de Django espere
    return this.http.get<any>(`${this.API_URL}/mis-reservas/`).pipe(
      catchError((err: any) => {
        this.error.set(this.parsearErrorDjango(err));
        return of([]);
      })
    );
  }

  /**
    Parsea los diferentes formatos de error que puede retornar Django REST Framework.
    DRF puede enviar errores como string, objeto con "detail",
    objeto con "non_field_errors" o un objeto con campos específicos.
   */
  private parsearErrorDjango(err: any): string {
    // Sin conexión al servidor
    if (err.status === 0) {
      return 'No se pudo conectar al servidor. Verifica que el backend esté activo.';
    }

    // Token expirado o inválido
    if (err.status === 401) {
      return 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.';
    }

    // Sin permisos
    if (err.status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }

    if (err.error) {
      // Error estándar de DRF: { "detail": "..." }
      if (typeof err.error === 'string') {
        return err.error;
      }

      if (err.error.detail) {
        return err.error.detail;
      }

      // Errores de validación general del serializer
      if (err.error.non_field_errors) {
        return Array.isArray(err.error.non_field_errors)
          ? err.error.non_field_errors[0]
          : err.error.non_field_errors;
      }

      // Tomamos el primer campo con error del serializer
      const primerCampo = Object.keys(err.error)[0];
      if (primerCampo) {
        const mensajeCampo = err.error[primerCampo];
        return Array.isArray(mensajeCampo)
          ? `${primerCampo}: ${mensajeCampo[0]}`
          : `${primerCampo}: ${mensajeCampo}`;
      }
    }

    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
