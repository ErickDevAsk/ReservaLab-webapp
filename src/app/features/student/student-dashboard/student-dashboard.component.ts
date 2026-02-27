import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from '../../../shared/ui/summary-card/summary-card';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent],
  templateUrl: './student-dashboard.component.html',
})
export class StudentDashboardComponent {
  // Aquí gestionaremos el estado del menú móvil con un Signal
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }
}