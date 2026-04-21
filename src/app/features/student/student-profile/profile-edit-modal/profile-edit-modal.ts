import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Súper importante para usar ngModel

@Component({
  selector: 'app-profile-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit-modal.html',
  styleUrl: './profile-edit-modal.scss'
})
export class ProfileEditModal {
  // Eventos para avisarle al componente padre (student-profile)
  @Output() alCerrar = new EventEmitter<void>();
  @Output() alGuardar = new EventEmitter<{ telefono: string, equipo: string, habilidades: string }>();

  // Variables para guardar lo que el usuario escribe
  nuevoTelefono: string = '';
  nuevoEquipo: string = '';
  nuevasHabilidades: string = '';

  guardarCambios() {
    // Enviamos los datos al componente padre.
    // Si están vacíos, mandaremos textos vacíos (el backend sabrá ignorarlos)
    this.alGuardar.emit({
      telefono: this.nuevoTelefono,
      equipo: this.nuevoEquipo,
      habilidades: this.nuevasHabilidades
    });
  }
}
