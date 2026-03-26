import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
//Importamos el servicio desde su nueva ubicación
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = {
    username: '',
    email: '',
    password: '',
    matricula_id: '',
    carrera_departamento: ''
  };

  onSubmit() {
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        alert('Hubo un error al registrarte. Revisa tus datos e intenta de nuevo.');
      }
    });
  }
}
