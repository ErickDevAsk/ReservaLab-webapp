import { Component } from '@angular/core';
import { EquiposService, Equipo } from '../services/equipos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-equipos.html',
  styleUrl: './gestion-equipos.scss',
})
export class GestionEquipos {

  equipos: Equipo[] = [];

  nuevoEquipo: Equipo = {
    nombre: '',
    descripcion: '',
    numero_inventario: '',
    cantidad_total: 0,
    cantidad_disponible: 0,
    estado: 'disponible',
    laboratorio: null
  };

  mostrarFormulario = false;

  modoEdicion = false;
equipoEditandoId: number | null = null;

constructor(private equiposService: EquiposService) {}

ngOnInit() {
  this.cargarEquipos();
}

cargarEquipos() {
  this.equiposService.getEquipos().subscribe(data => {
    this.equipos = data;
    console.log("EQUIPOS:", this.equipos);
  });
}

eliminar(id: number) {
  const confirmar = confirm("¿Seguro que quieres eliminar este equipo?");

  if (confirmar) {
    this.equiposService.eliminarEquipo(id).subscribe({
      next: () => {
        console.log("Equipo eliminado");

        // 🔥 refrescar lista
        this.cargarEquipos();
      },
      error: (err) => {
        console.error("Error al eliminar:", err);
      }
    });
  }
}

toggleFormulario() {
  this.mostrarFormulario = !this.mostrarFormulario;
}

editarEquipo(equipo: Equipo) {
  this.mostrarFormulario = true;
  this.modoEdicion = true;

  this.equipoEditandoId = equipo.id!;

  // cargar datos al formulario
  this.nuevoEquipo = { ...equipo };
}

guardarEquipo() {

  if (this.modoEdicion && this.equipoEditandoId) {

    // ✏ EDITAR
    this.equiposService.actualizarEquipo(this.equipoEditandoId, this.nuevoEquipo).subscribe({
      next: () => {
        console.log("Equipo actualizado");

        this.cargarEquipos();
        this.resetFormulario();
      },
      error: (err) => {
        console.error("Error al actualizar:", err);
      }
    });

  } else {

    // ➕ CREAR
    this.equiposService.crearEquipo(this.nuevoEquipo).subscribe({
      next: () => {
        console.log("Equipo creado");

        this.cargarEquipos();
        this.resetFormulario();
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });

  }
}

resetFormulario() {
  this.mostrarFormulario = false;
  this.modoEdicion = false;
  this.equipoEditandoId = null;

  this.nuevoEquipo = {
    nombre: '',
    descripcion: '',
    numero_inventario: '',
    cantidad_total: 0,
    cantidad_disponible: 0,
    estado: 'disponible',
    laboratorio: null
  };
}

}


