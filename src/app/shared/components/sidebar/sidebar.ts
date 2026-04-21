import { Component, inject, signal } from '@angular/core';
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
export class SidebarComponent {
  private readonly router = inject(Router);
  
  // Solución al error rojo: Declaramos la variable de estado
  public sidebarCollapsed = signal<boolean>(false);

  // Detectamos el rol del usuario desde el token
  public userRole = signal<string | null>(this.getRoleFromToken());

  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol; // Retorna 'tecnico' o 'Estudiante'
    } catch {
      return null;
    }
  }

  // Método para el botón de colapsar
  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  // Métodos de navegación inteligente
  getDashboardRoute(): string {
    return this.userRole() === 'tecnico' ? '/tecnico/dashboard' : '/student/dashboard';
  }

  getProfileRoute(): string {
    return this.userRole() === 'tecnico' ? '/tecnico/perfil' : '/student/perfil';
  }

  cerrarSesion() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login-reserva']);
  }
}