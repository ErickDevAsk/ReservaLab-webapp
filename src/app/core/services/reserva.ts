import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';

// Estructura JSON para la reserva de laboratorio
export interface Reserva{
  laboratorio: string;    // Nombre del lab
  fecha: string;          // YYYY-MM-DD
  hora_inicio: string;    // HH:MM:SS
  duracion: number;       // 1 a 4
  equipo: string;         // Nombre del equipo
  proposito: string;      // Mínimo 10 caracteres
}

@Injectable({
  providedIn: 'root',
})

export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/reservas'; // URL base de Django

  // Signals para manejar el estado en Angular 20
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public success = signal<boolean>(false);

  /**
   * Envía la solicitud de reserva al backend
   */
  crearReserva(datos: Reserva) {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    return this.http.post(`${this.API_URL}/crear/`, datos).pipe(
      tap(() => this.success.set(true)),
      catchError((err) => {
        // Captura el error enviado por Django
        const mensajeError = err.error?.message || 'Error al procesar la reserva';
        this.error.set(mensajeError);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Consulta disponibilidad (Misión: Validaciones en tiempo real) [cite: 27]
   */
  consultarDisponibilidad(lab: string, fecha: string) {
    return this.http.get<any>(`${this.API_URL}/disponibilidad/`, {
      params: { lab, fecha }
    });
  }
}
