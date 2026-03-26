import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notificacion } from '../../../core/services/notification'; // Importamos el servicio de notificaciones para acceder a las notificaciones activas

// Componente de Toast para mostrar notificaciones visuales
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  notifService = inject(NotificationService);

  // Métodos para determinar clases e íconos según el tipo de notificación
  clasesTipo(tipo: Notificacion['tipo']): string {
    const mapa: Record<Notificacion['tipo'], string> = {
      success: 'toast--success',
      error:   'toast--error',
      warning: 'toast--warning',
      info:    'toast--info',
    };
    return mapa[tipo];
  }

  // Método para obtener el ícono SVG según el tipo de notificación
  icono(tipo: Notificacion['tipo']): string {
    const iconos: Record<Notificacion['tipo'], string> = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>`,
      error:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <path d="M12 9v4"/><path d="M12 17h.01"/>
                </svg>`,
      info:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>`,
    };
    return iconos[tipo];
  }

  // Método trackBy para optimizar ngFor
  trackById(_: number, notif: Notificacion): number {
    return notif.id;
  }
}