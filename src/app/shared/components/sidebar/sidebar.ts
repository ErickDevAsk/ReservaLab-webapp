import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss' // Si tienes estilos específicos
})
export class SidebarComponent {
  private readonly router = inject(Router);

  // Mantenemos esto por si en móvil quieren colapsarlo
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  cerrarSesion() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
  irADashboard() { this.router.navigate(['/student-dashboard']); }
  irALanding()   { this.router.navigate(['/']); }

}
