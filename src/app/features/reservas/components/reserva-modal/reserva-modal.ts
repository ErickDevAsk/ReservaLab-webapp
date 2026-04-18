//Refactorización completa del componente de reserva-modal.ts para integrar la selección de equipos desde el inventario. 
// Se agregan validaciones, manejo de estado y mejoras en la UX.

import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification';
import { LaboratorioService } from '../../../../core/services/laboratorio';
// NUEVO: Importamos el servicio y la interfaz de equipos
import { EquipoService, Equipo } from '../../../../core/services/equipo';
// Interfaz para manejar el estado de selección de cada equipo en la UI
export interface EquipoSeleccionado extends Equipo {
  seleccionado: boolean;
  cantidadRequerida: number;
}

@Component({
  selector: 'app-reserva-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-modal.html',
  styleUrl: './reserva-modal.scss',
})
export class ReservaModal implements OnInit {

  // Servicios 
  private readonly notifService  = inject(NotificationService);
  private readonly labService    = inject(LaboratorioService);
  private readonly equipoService = inject(EquipoService);

  // Inputs desde el dashboard 
  fechaDisplay = input.required<string>();
  hora         = input.required<string>();

  // Outputs hacia el dashboard 
  alCerrar    = output<void>();
  alConfirmar = output<any>();

  // Estado del formulario
  laboratorio = '';
  duracion    = 1;
  proposito   = '';

  // Estado de carga 
  cargandoLabs    = false;
  cargandoEquipos = false;

  // Listas de datos 
  laboratorios: any[]               = [];
  equiposDisponibles: EquipoSeleccionado[] = [];

  // Computed: equipos que el usuario marcó 
  get equiposSeleccionados(): EquipoSeleccionado[] {
    return this.equiposDisponibles.filter(eq => eq.seleccionado);
  }

  get hayEquiposSeleccionados(): boolean {
    return this.equiposSeleccionados.length > 0;
  }

  // Lifecycle
  ngOnInit(): void {
    this.cargarLaboratorios();
    this.cargarEquipos();
  }

  //Carga de datos 

  cargarLaboratorios(): void {
    this.cargandoLabs = true;

    this.labService.getLaboratorios().subscribe({
      next: (datos: any) => {
        this.laboratorios = datos;
        this.cargandoLabs = false;
      },
      error: () => {
        this.notifService.advertencia(
          'No se pudieron cargar los laboratorios. Verifica el backend.'
        );
        this.cargandoLabs = false;
      },
    });
  }

  cargarEquipos(): void {
    this.cargandoEquipos = true;

    this.equipoService.getEquipos().subscribe({
      next: (equipos: Equipo[]) => {
        // Mapeamos cada equipo agregando las propiedades de UI
        this.equiposDisponibles = equipos.map(eq => ({
          ...eq,
          seleccionado:      false,
          cantidadRequerida: 1,
        }));
        this.cargandoEquipos = false;
      },
      error: () => {
        this.notifService.advertencia(
          'No se pudieron cargar los equipos del inventario.'
        );
        this.cargandoEquipos = false;
      },
    });
  }

  // Interacciones del usuario 

   // Alterna la selección de un equipo. Si no hay stock disponible, bloquea la selección e informa al usuario.
  toggleEquipo(equipo: EquipoSeleccionado): void {
    if (equipo.cantidad_disponible === 0 && !equipo.seleccionado) {
      this.notifService.advertencia(
        `"${equipo.nombre}" no tiene unidades disponibles actualmente.`
      );
      return;
    }
    equipo.seleccionado = !equipo.seleccionado;

    // Si se deselecciona, reseteamos la cantidad requerida
    if (!equipo.seleccionado) {
      equipo.cantidadRequerida = 1;
    }
  }

   // Valida que la cantidad requerida no supere el stock disponible.
  validarCantidad(equipo: EquipoSeleccionado): void {
    if (equipo.cantidadRequerida < 1) {
      equipo.cantidadRequerida = 1;
    }
    if (equipo.cantidadRequerida > equipo.cantidad_disponible) {
      equipo.cantidadRequerida = equipo.cantidad_disponible;
      this.notifService.advertencia(
        `Solo hay ${equipo.cantidad_disponible} unidades de "${equipo.nombre}" disponibles.`
      );
    }
  }

   // Retorna la clase CSS del badge de estado del equipo.
  getBadgeClase(equipo: Equipo): string {
    if (equipo.cantidad_disponible === 0) {
      return 'bg-red-100 text-red-600';
    }
    if (equipo.cantidad_disponible <= 2) {
      return 'bg-yellow-100 text-yellow-600';
    }
    return 'bg-green-100 text-green-700';
  }

  getBadgeTexto(equipo: Equipo): string {
    if (equipo.cantidad_disponible === 0) return 'Sin stock';
    if (equipo.cantidad_disponible <= 2) return `Últimas ${equipo.cantidad_disponible}`;
    return `${equipo.cantidad_disponible} disponibles`;
  }

  // Validación y envío de la reserva al dashboard

  confirmarReserva(): void {
    // Validación: laboratorio
    if (!this.laboratorio) {
      this.notifService.advertencia('Por favor, selecciona un laboratorio.');
      return;
    }

    // Validación: al menos un equipo seleccionado
    if (!this.hayEquiposSeleccionados) {
      this.notifService.advertencia(
        'Selecciona al menos un equipo para tu reserva.'
      );
      return;
    }

    // Validación: propósito mínimo
    if (this.proposito.trim().length < 10) {
      this.notifService.advertencia(
        'El propósito debe tener al menos 10 caracteres.'
      );
      return;
    }

    // Armamos el payload con los equipos seleccionados
    const equiposPayload = this.equiposSeleccionados.map(eq => ({
      id:               eq.id,
      nombre:           eq.nombre,
      cantidadRequerida: eq.cantidadRequerida,
    }));

    this.alConfirmar.emit({
      laboratorio: this.laboratorio,
      equipos:     equiposPayload,
      // Mantenemos compatibilidad con el campo "equipo" que espera el backend
      equipo:      equiposPayload.map(e => e.nombre).join(', '),
      duracion:    this.duracion,
      proposito:   this.proposito.trim(),
    });
  }

  cerrar(): void {
    this.alCerrar.emit();
  }
}