// NUEVO: Importamos OnInit y tu nuevo servicio
import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification';
// NUEVO: Asegúrate de que esta ruta apunte bien a donde creaste tu servicio
import { LaboratorioService } from '../../../../core/services/laboratorio';

@Component({
  selector: 'app-reserva-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.scss',
})
// NUEVO: Le agregamos implements OnInit para que ejecute código al abrirse
export class ReservaModal implements OnInit {

  private readonly notifService = inject(NotificationService);
  private readonly labService = inject(LaboratorioService); // NUEVO: Inyectamos el gerente de laboratorios

  // Inputs desde el dashboard
  fechaDisplay = input.required<string>();
  hora = input.required<string>();

  // Outputs hacia el dashboard ─
  alCerrar    = output<void>();
  alConfirmar = output<any>();

  // Formulario
  laboratorio = '';
  equipo      = '';
  duracion    = 1;
  proposito   = '';

  // NUEVO: Quitamos el readonly y los datos falsos. Ahora es un arreglo vacío que llenaremos.
  laboratorios: any[] = [];

  // Opciones de equipo (Este lo dejamos igual por ahora hasta que hagan la tabla de equipos)
  readonly equipos = [
    'Microscopio Óptico',
    'Osciloscopio Digital',
    'Centrifugadora',
    'Espectrofotómetro',
    'Balanza Analítica',
  ];

  readonly normas = [
    'Llegar puntual a la reserva',
    'Devolver el equipo en las mismas condiciones',
    'Reportar cualquier daño o incidencia inmediatamente',
    'Cancelar con al menos 24 horas de anticipación si no podrás asistir',
  ];

  // NUEVO: Este método se ejecuta automáticamente en cuanto se abre el modal
  ngOnInit() {
    this.labService.obtenerLaboratorios().subscribe({
      next: (datosReales: any) => {
        // Llenamos la variable con la respuesta de Django
        this.laboratorios = datosReales;
      },
      error: (err: any) => {
        console.error('Error al traer laboratorios:', err);
        this.notifService.advertencia('No se pudieron cargar los laboratorios. Verifica el backend.');
      }
    });
  }

  // Métodos
  confirmarReserva() {
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
