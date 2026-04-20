import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Ocultamos temporalmente la importación de la base de datos
// import { LaboratorioService, Laboratorio } from '../../../core/services/laboratorio';

@Component({
  selector: 'app-lab-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-catalog.html',
  styleUrls: ['./lab-catalog.scss']
})
export class LabCatalogComponent implements OnInit {
  filtroActual: string = 'Todos';
  
  // 🔥 Le metemos datos "falsos" temporalmente para ver el diseño
  laboratorios: any[] = [
    { 
      nombre: 'Laboratorio de Software', 
      edificio: 'CCO4', 
      facultad: 'FCC', 
      capacidad: 40, 
      imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 
      estado: 'Libre' 
    },
    { 
      nombre: 'Laboratorio de Redes', 
      edificio: 'CCO3', 
      facultad: 'FCC', 
      capacidad: 30, 
      imagen: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 
      estado: 'Ocupado' 
    },
    { 
      nombre: 'Laboratorio de Química Analítica', 
      edificio: 'QUM1', 
      facultad: 'FIQ', 
      capacidad: 25, 
      imagen: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', 
      estado: 'Libre' 
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Comentamos la llamada real a Django hasta que haya datos
    // this.cargarLaboratoriosDesdeDjango();
  }

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