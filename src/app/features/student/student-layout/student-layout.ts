import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-student-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    SidebarComponent],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss',
})
export class StudentLayout {
  private readonly router = inject(Router);

  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  irALanding() {
    this.router.navigate(['/']);
  }

  cerrarSesion() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

}
