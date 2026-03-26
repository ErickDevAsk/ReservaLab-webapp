import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SummaryCardComponent } from '../../../shared/ui/summary-card/summary-card';
import { LabCatalogComponent } from '../../labs/lab-catalog/lab-catalog';
//Definición de la interfaz para las reservas
export interface Reserva{
  id: number;
  recurso: string;
  laboratorio: string;
  fecha: string;
  hora: string;
  estado: 'Confirmada' | 'Pendiente' | 'Rechazada';
}

//Definición de la interfaz para los préstamos
export interface Prestamo{
  id: number;
  equipo: string;
  codigo: string;
  vencimiento: string;
}

@Component({  
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, LabCatalogComponent, RouterLink],
  templateUrl: './student-dashboard.component.html',
})
export class StudentDashboardComponent {
  // Aquí gestionaremos el estado del menú móvil con un Signal
  isMobileMenuOpen = signal(false);

  //Datos de pruebla para las reservas
  proximasReservas = signal<Reserva[]>([
    { id: 1, recurso: 'Microscopio Digital', laboratorio: 'Laboratorio de Física', fecha: '4 de febrero', hora: '10:00 - 12:00', estado: 'Confirmada' },
    { id: 2, recurso: 'Kit de Titulación', laboratorio: 'Laboratorio de Química', fecha: '6 de febrero', hora: '14:00 - 16:00', estado: 'Confirmada' },
    { id: 3, recurso: 'Estación de Trabajo Pro', laboratorio: 'Laboratorio de Computación', fecha: '9 de febrero', hora: '09:00 - 11:00', estado: 'Pendiente' }
  ]);

  //Datos de prueba para los préstamos
  prestamosActuales = signal<Prestamo[]>([
    { id: 1, equipo: 'Osciloscopio Tektronix', codigo: 'OSC-001', vencimiento: '5 de febrero de 2026' },
    { id: 2, equipo: 'Multímetro Digital', codigo: 'MUL-042', vencimiento: '7 de febrero de 2026' }
  ]);

  toggleMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  // Método para obtener la clase CSS según el estado de la reserva
  obtenerClaseEstado(estado: string): string {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold ';
    const estilos: Record<string, string> = {
      'Confirmada': 'bg-green-100 text-green-700',
      'Pendiente': 'bg-yellow-100 text-yellow-700',
      'Rechazada': 'bg-red-100 text-red-700'
    };
    return base + (estilos[estado] || 'bg-slate-100 text-slate-700');
  }

  // Métodos para las acciones (Por ahora solo imprimen en consola)
  devolverEquipo(id: number) {
    console.log('Devolviendo equipo con ID:', id);
    // Aquí irá la lógica para llamar al servicio de Django de Devoluciones [cite: 406]
  }

  reportarIncidencia(id: number) {
    console.log('Reportando incidencia para equipo con ID:', id);
    // Aquí se abrirá el modal de incidencias [cite: 569]
  }
}