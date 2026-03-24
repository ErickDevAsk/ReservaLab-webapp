import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lab-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-catalog.html'
})
export class LabCatalogComponent {
  // Filtro activo por defecto
  filtroActual: string = 'Todos';

  // Datos simulados (Mock) para diseñar
  laboratorios = [
    { 
      id: 1, 
      nombre: 'Lab de Redes y Seguridad', 
      facultad: 'FCC', 
      ubicacion: 'Edificio CCO1 - Planta Alta', 
      capacidad: 30, 
      imagen: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: 2, 
      nombre: 'Lab de Operaciones Unitarias', 
      facultad: 'FIQ', 
      ubicacion: 'Edificio IQ2 - Planta Baja', 
      capacidad: 25, 
      imagen: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: 3, 
      nombre: 'Centro de Desarrollo de Software', 
      facultad: 'FCC', 
      ubicacion: 'Edificio CCO2', 
      capacidad: 45, 
      imagen: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' 
    }
  ];

  // Lógica del buscador inteligente
  get laboratoriosFiltrados() {
    if (this.filtroActual === 'Todos') {
      return this.laboratorios;
    }
    return this.laboratorios.filter(lab => lab.facultad === this.filtroActual);
  }

  setFiltro(facultad: string) {
    this.filtroActual = facultad;
  }
}