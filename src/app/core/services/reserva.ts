import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';

export interface Reserva {
  laboratorio: string;
  fecha: string;
  hora_inicio: string;
  duracion: number;
  equipo: string;
  proposito: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private readonly http = inject(HttpClient);

  // URL corregida con slash final para evitar redirección
  private readonly API_URL = 'http://localhost:8000/api/reservas';

  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public success = signal<boolean>(false);

  crearReserva(datos: any) {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    // Eliminamos los headers manuales. El authInterceptor los inyecta automáticamente en TODAS las peticiones.
    return this.http.post(`${this.API_URL}/crear/`, datos).pipe(
      tap(() => this.success.set(true)),
      catchError((err) => {
        // Leemos correctamente los errores de DRF
        // DRF puede retornar errores como objeto o como string
        let mensajeError = 'Error al procesar la reserva. Intenta de nuevo.';

        if (err.error) {
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error.detail) {
            // Error estándar de DRF (ej: 401, 403)
            mensajeError = err.error.detail;
          } else if (err.error.non_field_errors) {
            // Errores de validación general del serializer
            mensajeError = err.error.non_field_errors[0];
          } else {
            // Tomamos el primer campo con error
            const primerCampo = Object.keys(err.error)[0];
            mensajeError = `${primerCampo}: ${err.error[primerCampo][0]}`;
          }
        }

        this.error.set(mensajeError);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  consultarDisponibilidad(lab: string, fecha: string) {
    return this.http.get<any>(`${this.API_URL}/disponibilidad/`, {
      params: { lab, fecha },
    });
  }
}