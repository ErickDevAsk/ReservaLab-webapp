import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡Clave para el formulario!

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.scss']
})
export class GestionUsuariosComponent {
  // Lista temporal de técnicos (Luego vendrá del backend de Erick)
  tecnicos = [
    { id: 1, nombre: 'Luis Ortiz', correo: 'luis.ortiz@buap.mx', estado: 'Activo' },
    { id: 2, nombre: 'Christian', correo: 'christian@buap.mx', estado: 'Activo' },
    { id: 3, nombre: 'Ángel', correo: 'angel.inv@buap.mx', estado: 'En Turno' }
  ];

  // Variables donde se guardará lo que escribas en el formulario
  nuevoTecnico = {
    nombre: '',
    correo: '',
    password: ''
  };

  // Función que se ejecuta al darle click al botón de guardar
  registrarTecnico() {
    if(this.nuevoTecnico.nombre && this.nuevoTecnico.correo) {
      alert(`¡Técnico ${this.nuevoTecnico.nombre} registrado correctamente!`);
      // Aquí más adelante haremos el POST a la API de Erick
      
      // Limpiamos el formulario después de guardar
      this.nuevoTecnico = { nombre: '', correo: '', password: '' };
    } else {
      alert('Por favor llena los campos requeridos.');
    }
  }
}