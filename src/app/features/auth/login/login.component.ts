import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode } from "jwt-decode"
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    console.log('Enviando a Django:', this.loginData);
    const url = `${environment.apiUrl}token/`;

    this.http.post(url, this.loginData).subscribe({
      next: (res: any) => {
        if (res.access) {
          localStorage.setItem('access_token', res.access);

          // 1. Decodificamos el token
          const decodedToken: any = jwtDecode(res.access);


          console.log('📦 GAFETE DESENCRIPTADO:', decodedToken);

          // 3. Extraemos el rol
          const rolUsuario = decodedToken.rol;

          console.log('Rol detectado:', rolUsuario);

          // Redirigimos según el rol
          switch(rolUsuario) {
            case 'tecnico':
              this.router.navigate(['/tecnico-dashboard']);
              break;
            case 'Administrador':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'Estudiante':
              this.router.navigate(['/student-dashboard']);
              break;
            default:
              alert('Rol no reconocido');
              this.router.navigate(['/']); // Fallback
          }
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error: Usuario no encontrado o servidor apagado.');
      }
    });
  }
}
