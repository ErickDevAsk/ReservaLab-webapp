import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(state => !state);
  }
}
