import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importamos tu nuevo servicio y la interfaz
import { LaboratorioService, Laboratorio } from '../../../core/services/laboratorio';

@Component({
  selector: 'app-lab-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-catalog.html'
})
export class LabCatalogComponent implements OnInit {
  filtroActual: string = 'Todos';

  // 2. Ahora nuestro arreglo empieza vacío, esperando los datos de Django
  laboratorios: Laboratorio[] = [];

  // 3. Inyectamos al "repartidor" en el constructor
  constructor(private laboratorioService: LaboratorioService) {}

  // 4. ngOnInit se ejecuta automáticamente en cuanto la pantalla carga
  ngOnInit(): void {
    this.cargarLaboratoriosDesdeDjango();
  }

  // 5. La función que hace la llamada a la base de datos
  cargarLaboratoriosDesdeDjango(): void {
    // Nos suscribimos para escuchar la respuesta del servidor
    this.laboratorioService.getLaboratorios().subscribe({
      next: (datosQueLlegaron: any) => {
        this.laboratorios = datosQueLlegaron;
        console.log('¡Datos descargados de Django!', datosQueLlegaron);
      },
      error: (error: any) => {
        console.error('Hubo un error al conectar con Django:', error);
      }
    });
  }

  // ¡TUS FILTROS MAGISTRALES SE QUEDAN INTACTOS!
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
