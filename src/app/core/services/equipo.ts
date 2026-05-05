import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, finalize } from 'rxjs';

// Interfaces de Datos
export interface Equipo {
  id: number;
  nombre: string;
  descripcion?: string;
  numero_inventario: string;
  cantidad_total: number;
  cantidad_disponible: number;
  estado: 'Disponible' | 'En Uso' | 'Mantenimiento' | 'Dañado' | string;
  laboratorio?: number | null;
  laboratorio_nombre?: string;
}

export type EquipoPayload = Omit<Equipo, 'id' | 'laboratorio_nombre'>;

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private readonly http = inject(HttpClient);

  // URLs de la API (Asegúrate de que coincidan con tus urls.py de Django)
  private readonly API_EQUIPOS = 'http://localhost:8000/api/equipos/';
  private readonly API_LOANS = 'http://localhost:8000/api/loans/';

  // Signals de estado
  public loading = signal<boolean>(false);

  /**
   * Obtiene todos los equipos del inventario real en Django.
   */
  getEquipos(): Observable<Equipo[]> {
    this.loading.set(true);
    return this.http.get<Equipo[]>(this.API_EQUIPOS).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Filtra equipos directamente desde el backend por estado disponible.
   */
  getEquiposDisponibles(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.API_EQUIPOS}?estado=Disponible`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 🔥 NUEVO: Envía la solicitud de préstamo al servidor.
   * El interceptor de auth se encargará de adjuntar el Token automáticamente.
   */
  solicitarPrestamo(payload: any): Observable<any> { // Cambiamos el tipo a 'any' para evitar conflictos
    this.loading.set(true);
    return this.http.post<any>(this.API_LOANS, payload).pipe(
      catchError(this.handleError),
      finalize(() => this.loading.set(false))
    );
  }

  // --- Operaciones de CRUD (Para la zona administrativa) ---

  crearEquipo(payload: EquipoPayload): Observable<Equipo> {
    return this.http.post<Equipo>(this.API_EQUIPOS, payload).pipe(catchError(this.handleError));
  }

  actualizarEquipo(id: number, payload: EquipoPayload): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.API_EQUIPOS}${id}/`, payload).pipe(catchError(this.handleError));
  }

  eliminarEquipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_EQUIPOS}${id}/`).pipe(catchError(this.handleError));
  }

  /**
   * Manejador de errores centralizado para evitar redundancia.
   */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      mensaje = 'No hay conexión con el servidor de ReservaLab.';
    } else if (error.status === 400) {
      mensaje = 'Datos de solicitud inválidos.';
    } else if (error.status === 500) {
      mensaje = 'Error interno del servidor (Django).';
    }

    console.error(`Código de error ${error.status}:`, error.message);
    return throwError(() => new Error(mensaje));
  }
/**
 * Obtiene todas las solicitudes de préstamo (Para el Técnico)
 */
  getTodasLasSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_LOANS).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza el estado de un préstamo (Aprobar/Rechazar/Entregar)
   * @param id ID del préstamo
   * @param nuevoEstado 'En curso', 'Entregado', 'Devuelto', etc.
   */
  actualizarEstadoPrestamo(id: number, nuevoEstado: string): Observable<any> {
    // Usamos PATCH para solo actualizar el campo del estado
    return this.http.patch<any>(`${this.API_LOANS}${id}/`, { estado: nuevoEstado }).pipe(
      catchError(this.handleError)
    );
  }

  getMisPrestamos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_LOANS).pipe(
      catchError(this.handleError)
    );
  }

}
