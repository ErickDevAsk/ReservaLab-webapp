import { Equipo, EquipoService, EquipoPayload } from '../../../core/services/equipo';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LaboratorioService } from '../../../core/services/laboratorio';

@Component({
  selector: 'app-equipo-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './equipo-modal.html',
})
export class EquipoModalComponent implements OnInit {

  // Si viene con datos → modo edición, si no → modo creación
  @Input() equipo: Equipo | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Equipo>();

  private equipoService = inject(EquipoService);
  private labService = inject(LaboratorioService);

  laboratorios: any[] = [];
  cargandoLabs = false;
  guardando = false;

  estados = ['Disponible', 'En Uso', 'Mantenimiento', 'Dañado'];

  form: EquipoPayload = {
    nombre: '',
    descripcion: '',
    numero_inventario: '',
    cantidad_total: 1,
    cantidad_disponible: 1,
    estado: 'Disponible',
    laboratorio: null,
  };

  get modoEdicion(): boolean {
    return !!this.equipo;
  }

  ngOnInit(): void {
    // Si es edición, cargamos los datos en el form
    if (this.equipo) {
      this.form = {
        nombre: this.equipo.nombre,
        descripcion: this.equipo.descripcion ?? '',
        numero_inventario: this.equipo.numero_inventario,
        cantidad_total: this.equipo.cantidad_total,
        cantidad_disponible: this.equipo.cantidad_disponible,
        estado: this.equipo.estado,
        laboratorio: this.equipo.laboratorio ?? null,
      };
    }

    this.cargarLabs();
  }

  cargarLabs(): void {
    this.cargandoLabs = true;
    this.labService.getLaboratorios().subscribe({
      next: (labs) => {
        this.laboratorios = labs;
        this.cargandoLabs = false;
      },
      error: () => this.cargandoLabs = false,
    });
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.numero_inventario) return;

    this.guardando = true;

    if (this.modoEdicion && this.equipo?.id) {
      this.equipoService.actualizarEquipo(this.equipo.id, this.form).subscribe({
        next: (updated) => {
          this.guardado.emit(updated);
          this.guardando = false;
        },
        error: () => this.guardando = false,
      });
    } else {
      this.equipoService.crearEquipo(this.form).subscribe({
        next: (created) => {
          this.guardado.emit(created);
          this.guardando = false;
        },
        error: () => this.guardando = false,
      });
    }
  }
  eliminar(id: number | undefined) {
    if (!id) return;
    if (confirm("¿Estás seguro de que deseas eliminar este laboratorio? Esta acción no se puede deshacer.")) {
      this.equipoService.eliminarEquipo(id).subscribe({
        next: () => {
          this.cargarLabs();
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
