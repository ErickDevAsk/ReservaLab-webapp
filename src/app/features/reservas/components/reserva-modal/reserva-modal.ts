import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.scss',
})
export class ReservaModal {
  // Recibimos la hora y el laboratorio del Dashboard
  horaInicio = input.required<string>();
  nombreLab = input<string>('Laboratorio de Cómputo');

  // Eventos para el padre
  alCerrar = output<void>();
  alConfirmar = output<any>();

  // Datos del formulario (Signals)
  duracion = signal<number>(1);
  equipo = signal<string>('');
  proposito = signal<string>('');

  /**
   * Valida y envía la reserva al Dashboard
   */
  confirmarReserva() {
    if (this.proposito().length < 10) {
      alert('Por favor, describe el propósito con al menos 10 caracteres.');
      return;
    }

    const reservaData = {
      hora_inicio: this.horaInicio(),
      duracion: this.duracion(),
      equipo: this.equipo(),
      proposito: this.proposito(),
      laboratorio: this.nombreLab()
    };

    this.alConfirmar.emit(reservaData);
  }

  cerrar() {
    this.alCerrar.emit();
  }
}
