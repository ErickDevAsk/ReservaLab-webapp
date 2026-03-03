import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.html',
})
export class SummaryCardComponent {
  // Entradas obligatorias usando Signals
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>(); // Clase de icono (p.ej. 'fas fa-calendar')
  
  // Clases de Tailwind personalizables para el color
  iconBgClass = input<string>('bg-blue-50');
  iconColorClass = input<string>('text-blue-600');
}