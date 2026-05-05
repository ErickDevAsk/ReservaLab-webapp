import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  private readonly router = inject(Router);

  public sidebarCollapsed = signal<boolean>(false);
  // Inicializamos con mayúscula para evitar errores si el token tarda en cargar
  public userRole = signal<string>('Estudiante');

  ngOnInit() {
    this.cargarRolDesdeToken();
  }

  private cargarRolDesdeToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.rol) {
          // Asignamos el rol exactamente como viene de Django (Ej: 'Tecnico')
          this.userRole.set(decoded.rol);
        }
      } catch (e) {
        console.error('El token no es válido o expiró:', e);
      }
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  // Rutas Dinámicas respetando la mayúscula
  // Rutas Dinámicas respetando la mayúscula
  getDashboardRoute(): string {
    const rol = this.userRole();
    if (rol === 'Administrador') return '/admin/dashboard';
    if (rol === 'Tecnico') return '/tecnico/dashboard';
    return '/student/dashboard'; // Fallback por defecto para Estudiante
  }

  getProfileRoute(): string {
    const rol = this.userRole();
    if (rol === 'Administrador') return '/admin/perfil';
    if (rol === 'Tecnico') return '/tecnico/perfil';
    return '/student/perfil';
  }

  cerrarSesion() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login-reserva']);
  }
}
