import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EquipoService, Equipo } from '../../../core/services/equipo';
import { EquipoModalComponent } from '../equipo-modal/equipo-modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal/confirm-modal';

@Component({
  selector: 'app-admin-gestion-equipos',
  imports: [EquipoModalComponent, ConfirmModalComponent],
  templateUrl: './admin-gestion-equipos.html',
  styleUrl: './admin-gestion-equipos.scss',
})
export class AdminGestionEquipos implements OnInit {
  modalAbierto = false;
  equipoSeleccionado: Equipo | null = null;
  equipos: any[] = [];

  confirmAbierto = false;
  eliminandoId: number | null = null;
  eliminando = false;

  constructor(private equipoService: EquipoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.equipoService.getEquipos().subscribe(data => {
      this.equipos = data;
      this.cdr.detectChanges();
    });
  }

  getStockClass(equipo: Equipo): string {
    if (equipo.cantidad_disponible === 0) return 'text-red-500 font-medium';
    return 'text-slate-600 font-medium';
  }

  getStatusClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible':    return 'bg-green-100/50 text-green-600 border border-green-200/60';
      case 'en uso':        return 'bg-blue-100/50 text-blue-600 border border-blue-200/60';
      case 'mantenimiento': return 'bg-yellow-100/50 text-yellow-600 border border-yellow-200/60';
      case 'dañado':        return 'bg-red-100/50 text-red-600 border border-red-200/60';
      default:              return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  }
  openModal(): void {
    this.equipoSeleccionado = null;
    this.modalAbierto = true;
  }

  editarEquipo(equipo: Equipo): void {
    this.equipoSeleccionado = equipo;
    this.modalAbierto = true;
  }

  eliminar(id: number): void {
    this.eliminandoId = id;
    this.confirmAbierto = true;
  }

  onGuardado(equipo: Equipo): void {
    // Si es edición, reemplaza en la lista
    const idx = this.equipos.findIndex(e => e.id === equipo.id);
    if (idx !== -1) {
      this.equipos[idx] = equipo;
    } else {
      this.equipos.push(equipo);
    }
    this.modalAbierto = false;
  }

  onCerrarModal(): void {
    this.modalAbierto = false;
  }
  cerrarConfirmacion(): void {
    this.confirmAbierto = false;
    this.eliminandoId = null;
    this.eliminando = false;
  }

  confirmarEliminar(): void {
    if (this.eliminandoId === null) return;

    this.eliminando = true; // Cambiamos el estado para mostrar un "Cargando..." si queremos

    // Llama a tu servicio (ajusta 'eliminarEquipo' al nombre real de tu método en el servicio)
    this.equipoService.eliminarEquipo(this.eliminandoId).subscribe({
      next: () => {
        // Removemos el equipo eliminado del array local para que desaparezca de la tabla
        this.equipos = this.equipos.filter(e => e.id !== this.eliminandoId);
        this.cerrarConfirmacion();
      },
      error: (err) => {
        console.error('Error al eliminar el equipo:', err);
        // Aquí podrías mostrar un Toast o alerta de error en el futuro
        this.eliminando = false;
      }
    });
  }
}
