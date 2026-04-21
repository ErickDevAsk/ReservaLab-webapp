import { Component, inject, OnInit, signal } from '@angular/core'; // Usamos signal
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminTecnicosService } from '../../../core/services/admin-tecnicos';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.scss']
})
export class GestionUsuariosComponent implements OnInit {
  private readonly adminService = inject(AdminTecnicosService);

  // Usamos un Signal para que Angular detecte el cambio instantáneamente
  public tecnicos = signal<any[]>([]);
  public cargando = signal<boolean>(false);

  nuevoTecnico = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    matricula_id: '',
    carrera_departamento: '',
    rol: 'Tecnico'
  };

  ngOnInit(): void {
    this.cargarTecnicos();
  }

  cargarTecnicos(): void {
    this.cargando.set(true);
    this.adminService.obtenerStaff().subscribe({
      next: (data: any) => {
        console.log('Datos brutos de Django:', data);

        // --- LA CIRUGÍA ---
        // 1. Extraemos de 'results' si Django está paginando
        let temp = data.results ? data.results : data;

        // 2. APLANADO AGRESIVO: Rompe cualquier nivel de arreglos anidados
        // Esto convierte [[[ {obj} ]]] en simplemente [ {obj} ]
        if (Array.isArray(temp)) {
          temp = temp.flat(Infinity);
        } else {
          temp = [temp];
        }

        // 3. Guardamos en el signal
        this.tecnicos.set(temp);

        console.log('Datos aplanados y listos:', this.tecnicos());
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar staff:', err);
        this.cargando.set(false);
      }
    });
  }

  registrarTecnico(): void {
    this.adminService.registrarNuevoTecnico(this.nuevoTecnico).subscribe({
      next: () => {
        alert('¡Técnico registrado!');
        this.cargarTecnicos();
        this.limpiarForm();
      },
      error: (err) => alert('Error al guardar. Revisa la consola.')
    });
  }
  darDeBaja(id: number): void {
  if (confirm('¿Estás seguro de que deseas eliminar a este técnico del sistema?')) {
    this.adminService.eliminarTecnico(id).subscribe({
      next: () => {
        alert('Técnico eliminado correctamente.');
        // Refrescamos la tabla para que desaparezca el que borramos
        this.cargarTecnicos();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar. Revisa si el técnico tiene registros asociados.');
      }
    });
  }
}

  private limpiarForm() {
    this.nuevoTecnico = {
      username: '', password: '', first_name: '', last_name: '',
      email: '', matricula_id: '', carrera_departamento: '', rol: 'Tecnico'
    };
  }

}
