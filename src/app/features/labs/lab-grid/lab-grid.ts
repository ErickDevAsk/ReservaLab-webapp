import { CommonModule, } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-lab-grid',
  imports: [CommonModule],
  templateUrl: './lab-grid.html',
  styleUrl: './lab-grid.scss',
})
export class LabGrid {
  // Datos mockeados listos para ser reemplazados por el fetch a Django
  laboratorios = signal([
    {
      id: 1,
      nombre: 'Laboratorio de Física',
      ubicacion: 'Edificio A - Piso 3',
      capacidad: 25,
      equipos: 12,
      estado: 'Disponible',
      // Imagen de prueba temporal
      imagen: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      nombre: 'Laboratorio de Química',
      ubicacion: 'Edificio C - Planta Baja',
      capacidad: 20,
      equipos: 5,
      estado: 'Disponible',
      imagen: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ]);
}
