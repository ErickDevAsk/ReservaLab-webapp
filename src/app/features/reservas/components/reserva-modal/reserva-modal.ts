import { Component, inject, input, output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification';
import { LaboratorioService } from '../../../../core/services/laboratorio';

@Component({
  selector: 'app-reserva-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.scss',
})
export class ReservaModal implements OnInit {
  // Servicios
  private readonly notifService = inject(NotificationService);
  private readonly labService   = inject(LaboratorioService);
  private readonly cdr          = inject(ChangeDetectorRef);

  // Inputs y Outputs
  fechaDisplay = input.required<string>();
  hora         = input.required<string>();
  alCerrar    = output<void>();
  alConfirmar = output<any>();

  // Estado del formulario
  laboratorio: number | null = null;
  duracion    = 1;
  proposito   = '';

  // Estado de carga
  cargandoLabs = false;
  laboratorios: any[] = [];

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargandoLabs = true;

    this.labService.getLaboratorios().subscribe({
      next: (datos: any) => {
        this.laboratorios = datos.results || datos;
        this.cargandoLabs = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notifService.advertencia('No se pudieron cargar los laboratorios.');
        this.cargandoLabs = false;
        this.cdr.markForCheck();
      },
    });
  }

  confirmarReserva(): void {
    if (!this.laboratorio) {
      this.notifService.advertencia('Por favor, selecciona un laboratorio.');
      return;
    }

    if (this.proposito.trim().length < 10) {
      this.notifService.advertencia('El propósito debe tener al menos 10 caracteres.');
      return;
    }

    this.alConfirmar.emit({
      laboratorio: this.laboratorio,
      duracion:    this.duracion,
      proposito:   this.proposito.trim(),
      // Mandamos valores por defecto vacíos por si la interfaz/backend aún los espera
      equipo:      'Ninguno',
      equipos:     []
    });
  }

  cerrar(): void {
    this.alCerrar.emit();
  }
}
