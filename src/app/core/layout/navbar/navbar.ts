import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMobileMenuOpen = signal(false);

  scrollTo(seccionId: string) {
    document.getElementById(seccionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(state => !state);
  }
}
