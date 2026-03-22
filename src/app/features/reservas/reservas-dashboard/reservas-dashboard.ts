import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-dashboard.html',
  styleUrl: './reservas-dashboard.scss',
})

export class ReservasDashboard {
  // Señales para el estado de la vista
  public mesAnio = signal<string>('marzo 2026');
  public fechaVisual = signal<string>('domingo, 22 de marzo');

  // Listado dinámico de horarios (simulado por ahora)
  public horarioSlots = signal([
    { hora: '08:00 - 09:00', disponible: true },
    { hora: '09:00 - 10:00', disponible: true },
    { hora: '10:00 - 11:00', disponible: true },
    { hora: '11:00 - 12:00', disponible: true },
    { hora: '12:00 - 13:00', disponible: true },
    { hora: '13:00 - 14:00', disponible: true },
    { hora: '14:00 - 15:00', disponible: true },
    { hora: '15:00 - 16:00', disponible: true },
    { hora: '16:00 - 17:00', disponible: true },
    { hora: '17:00 - 18:00', disponible: true },
    { hora: '18:00 - 19:00', disponible: true },
  ]);

  /**
   * Maneja el clic en un horario disponible
   */

  seleccionarSlot(slot: any) {
    if (slot.disponible) {
      console.log(`Iniciando reserva para el bloque: ${slot.hora}`);
      // Aquí dispararemos el Hito 3: El Modal
    }
  }
}
