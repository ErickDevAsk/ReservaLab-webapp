import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Importamos el servicio y la interfaz que ya tienes en tu core
import { LaboratorioService, Laboratorio } from '../../../core/services/laboratorio';

@Component({
  selector: 'app-lab-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-catalog.html',
  styleUrls: ['./lab-catalog.scss']
})
export class LabCatalogComponent implements OnInit {
  // Inyectamos el servicio
  private labService = inject(LaboratorioService);
  private router = inject(Router);

  // Usamos Signals para los datos y el estado de la carga
  laboratorios = signal<Laboratorio[]>([]);
  filtroActual = signal<string>('Todos');
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  // Un computed signal para los laboratorios filtrados
  // Se actualiza automáticamente cuando cambia laboratorios() o filtroActual()
  laboratoriosFiltrados = computed(() => {
    const actual = this.filtroActual();
    const todos = this.laboratorios();

    if (actual === 'Todos') {
      return todos;
    }
    // Asumimos que el modelo Laboratorio tiene el campo facultad
    return todos.filter(lab => lab.facultad === actual);
  });

  ngOnInit(): void {
    this.cargarLaboratoriosDesdeDjango();
  }

  cargarLaboratoriosDesdeDjango() {
    this.cargando.set(true);
    this.labService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al conectar con Django:', err);
        this.error.set('No se pudo establecer conexión con el servidor.');
        this.cargando.set(false);
      }
    });
  }

  setFiltro(facultad: string) {
    this.filtroActual.set(facultad);
  }

  // La función que ejecutará el botón
  irADetalle(id: number | undefined) {
    if (id) {
      // Navegamos a la ruta del estudiante y le pasamos el ID en la URL
      this.router.navigate(['/student/reservas'], { queryParams: { labId: id } });
    }
  }
}
