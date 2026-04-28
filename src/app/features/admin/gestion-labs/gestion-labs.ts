import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaboratorioService, Laboratorio } from '../../../core/services/laboratorio'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-gestion-labs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-labs.html'
})
export class GestionLabsComponent implements OnInit {
  private labService = inject(LaboratorioService);

  laboratorios: Laboratorio[] = [];

  // Controles del Modal
  mostrarModal = false;
  modoEdicion = false;
  guardando = false;

  // Estado del formulario
  form: Laboratorio = {
    nombre: '',
    edificio: '',
    facultad: 'Ciencias de la Computación',
    capacidad: 30,
    imagen: ''
  };

  ngOnInit() {
    this.cargarLaboratorios();
  }

  cargarLaboratorios() {
    this.labService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
      },
      error: (err) => console.error("Error al cargar labs:", err)
    });
  }

  abrirModalNuevo() {
    this.resetForm();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  editarLab(lab: Laboratorio) {
    this.form = { ...lab };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  onCerrar() {
    this.mostrarModal = false;
    this.resetForm();
  }

  guardar() {
    this.guardando = true;

    if (this.modoEdicion && this.form.id) {
      this.labService.actualizarLaboratorio(this.form.id, this.form).subscribe({
        next: () => {
          this.guardando = false;
          this.onCerrar();
          this.cargarLaboratorios();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.guardando = false;
        }
      });
    } else {
      this.labService.crearLaboratorio(this.form).subscribe({
        next: () => {
          this.guardando = false;
          this.onCerrar();
          this.cargarLaboratorios();
        },
        error: (err) => {
          console.error('Error al crear', err);
          this.guardando = false;
        }
      });
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    if (confirm("¿Estás seguro de que deseas eliminar este laboratorio? Esta acción no se puede deshacer.")) {
      this.labService.eliminarLaboratorio(id).subscribe({
        next: () => {
          this.cargarLaboratorios(); // Recarga la tabla
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  private resetForm() {
    this.form = {
      nombre: '',
      edificio: '',
      facultad: 'Ciencias de la Computación',
      capacidad: 30,
      imagen: ''
    };
  }
}
