import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-reserva-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.scss',
})
export class ReservaModal {

  private readonly notifService = inject(NotificationService);

  //  Inputs desde el dashboard 
  // Ej: "lunes, 16 de marzo de 2026"
  fechaDisplay = input.required<string>();
  // Ej: "08:00"
  hora = input.required<string>();

  //  Outputs hacia el dashboard ─
  alCerrar    = output<void>();
  alConfirmar = output<any>();

  //  Formulario (propiedades normales — no Signals, para compatibilidad con ngModel) 
  laboratorio = '';
  equipo      = '';
  duracion    = 1;
  proposito   = '';

  // Opciones de laboratorios (se reemplazarán con datos del backend)
  readonly laboratorios = [
    'Laboratorio de Física',
    'Laboratorio de Química',
    'Laboratorio de Biología',
    'Laboratorio de Computación',
  ];

  // Opciones de equipo (se reemplazarán con datos del backend)
  readonly equipos = [
    'Microscopio Óptico',
    'Osciloscopio Digital',
    'Centrifugadora',
    'Espectrofotómetro',
    'Balanza Analítica',
  ];

  // Normas de uso
  readonly normas = [
    'Llegar puntual a la reserva',
    'Devolver el equipo en las mismas condiciones',
    'Reportar cualquier daño o incidencia inmediatamente',
    'Cancelar con al menos 24 horas de anticipación si no podrás asistir',
  ];

  //  Métodos 
  confirmarReserva() {
    // Validaciones con notificaciones visuales (reemplaza los alert() anteriores)
    if (!this.laboratorio) {
      this.notifService.advertencia('Por favor, selecciona un laboratorio.');
      return;
    }
    if (!this.equipo) {
      this.notifService.advertencia('Por favor, selecciona el equipo necesario.');
      return;
    }
    if (this.proposito.trim().length < 10) {
      this.notifService.advertencia(
        'El propósito debe tener al menos 10 caracteres.'
      );
      return;
    }

    this.alConfirmar.emit({
      laboratorio: this.laboratorio,
      equipo:      this.equipo,
      duracion:    this.duracion,
      proposito:   this.proposito.trim(),
    });
  }

  cerrar() {
    this.alCerrar.emit();
  }
}