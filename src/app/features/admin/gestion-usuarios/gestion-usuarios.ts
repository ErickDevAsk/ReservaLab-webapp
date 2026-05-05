import { Component, inject, OnInit, signal } from '@angular/core';
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

  public tecnicos = signal<any[]>([]);
  public cargando = signal<boolean>(false);

  // Variables para controlar la Edición
  public isEditando = false;
  public idEdicionActual: number | null = null;

  nuevoTecnico = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    matricula_id: '',
    carrera_departamento: '',
    rol: 2
  };

  ngOnInit(): void {
    this.cargarTecnicos();
  }

  cargarTecnicos(): void {
    this.cargando.set(true);
    this.adminService.obtenerStaff().subscribe({
      next: (data: any) => {
        let temp = data.results ? data.results : data;
        if (Array.isArray(temp)) {
          temp = temp.flat(Infinity);
        } else {
          temp = [temp];
        }
        this.tecnicos.set(temp);
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
        alert('¡Técnico registrado con éxito!');
        this.cargarTecnicos();
        this.limpiarForm();
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar. Verifica que el username o correo no existan ya.');
      }
    });
  }

  darDeBaja(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar a este técnico del sistema?')) {
      this.adminService.eliminarTecnico(id).subscribe({
        next: () => {
          alert('Técnico eliminado correctamente.');
          this.cargarTecnicos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar. Revisa si el técnico tiene registros asociados.');
        }
      });
    }
  }

  // --- LÓGICA DE EDICIÓN ---

  prepararEdicion(tecnico: any): void {
    this.isEditando = true;
    this.idEdicionActual = tecnico.id;

    // Copiamos los datos del técnico al formulario
    this.nuevoTecnico = {
      username: tecnico.username,
      password: '', // No cargamos el password por seguridad
      first_name: tecnico.first_name,
      last_name: tecnico.last_name,
      email: tecnico.email,
      matricula_id: tecnico.matricula_id,
      carrera_departamento: tecnico.carrera_departamento,
      rol: 2
    };
  }

  actualizarTecnico(): void {
    if (!this.idEdicionActual) return;

    // 1. Extraemos 'password' y guardamos todo lo demás en 'datosAEnviar'
    // De esta forma, creamos un nuevo objeto limpio sin usar el operador 'delete'
    const { password, ...datosAEnviar } = this.nuevoTecnico;

    // 2. Enviamos los datos limpios a tu servicio
    this.adminService.actualizarTecnico(this.idEdicionActual, datosAEnviar).subscribe({
      next: () => {
        alert('Datos actualizados correctamente.');
        this.cargarTecnicos();
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error completo de Django:', err);
        let mensaje = 'Ocurrió un error al actualizar los datos.';
        if (err.error) {
          mensaje = JSON.stringify(err.error);
        }
        alert('Error de validación: ' + mensaje);
      }
    });
  }

  cancelarEdicion(): void {
    this.isEditando = false;
    this.idEdicionActual = null;
    this.limpiarForm();
  }

  private limpiarForm() {
    this.nuevoTecnico = {
      username: '', password: '', first_name: '', last_name: '',
      email: '', matricula_id: '', carrera_departamento: '', rol: 2
    };
  }
}
