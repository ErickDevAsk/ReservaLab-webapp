import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMobileMenuOpen = signal(false);

  // 👇 Nuevas Signals para manejar el estado del usuario
  isLoggedIn = signal(false);
  username = signal('');

  // 👇 Inyectamos el router para poder redireccionar al cerrar sesión
  router = inject(Router);

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Revisamos si el usuario tiene un token activo
    const token = localStorage.getItem('acces_token');
    if (token) {
      this.isLoggedIn.set(true);
      // Por ahora ponemos un nombre estático, luego lo leeremos del Token real
      this.username.set('Estudiante');
    }
  }

  logout() {
    // Destruimos la sesión
    localStorage.removeItem('acces_token');
    this.isLoggedIn.set(false);
    this.username.set('');
    // Lo mandamos al inicio
    this.router.navigate(['/']);
  }

  scrollTo(seccionId: string) {
    document.getElementById(seccionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(state => !state);
  }
}
