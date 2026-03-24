import { Injectable, signal } from '@angular/core';

export type NotifType = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: NotifType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  // Signal con la lista de toasts activos — mismo patrón que ReservaService
  // usa loading = signal<boolean>(false) y error = signal<string | null>(null)
  notificaciones = signal<Notificacion[]>([]);

  private nextId = 0;

  mostrar(mensaje: string, tipo: NotifType = 'info', duracion = 4000): void {
    const id = ++this.nextId;
    this.notificaciones.update(lista => [...lista, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), duracion);
  }

  cerrar(id: number): void {
    this.notificaciones.update(lista => lista.filter(n => n.id !== id));
  }

  // Helpers semánticos
  exito(mensaje: string): void       { this.mostrar(mensaje, 'success'); }
  error(mensaje: string): void       { this.mostrar(mensaje, 'error'); }
  advertencia(mensaje: string): void { this.mostrar(mensaje, 'warning'); }
  info(mensaje: string): void        { this.mostrar(mensaje, 'info'); }
}