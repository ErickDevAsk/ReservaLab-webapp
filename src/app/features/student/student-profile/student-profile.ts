import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { ProfileEditModal } from './profile-edit-modal/profile-edit-modal'; //Modal de editar
import { AuthService } from '../../../core/services/auth'; // Servicio de autenticación para actualizar perfil


@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ProfileEditModal],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss' // 👇 AQUÍ ESTÁ LA CONEXIÓN VITAL AL SCSS
})
export class StudentProfileComponent implements OnInit {
  isMobileMenuOpen = signal(false);
  private authService = inject(AuthService); // Inyectamos el servicio de autenticación

  // Inicializamos el signal con valores vacíos o de carga
  perfilData = signal({
    nombre: 'Cargando...',
    matricula: '',
    universidad: 'BUAP',
    carrera: '',
    correo: '',
    telefono: '',
    equipoRegistrado: '',
    habilidades: [] as string[]
  });

  //funciones para el modal de edición
  mostrarModal = signal(false);

  ngOnInit() {
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    this.authService.obtenerPerfil().subscribe({
      next: (datos) => {
        // Mapeamos los datos que vienen de Django a tu estructura de Signal
        // Asegúrate de usar los nombres de campos exactos que devuelve tu API
        this.perfilData.set({
          nombre: datos.username, // O el campo donde guardes el nombre completo
          matricula: datos.matricula_id,
          universidad: 'BUAP',
          carrera: datos.carrera_departamento,
          correo: datos.email,
          telefono: datos.telefono || 'Sin registrar',
          equipoRegistrado: datos.equipoRegistrado || 'Sin equipo',
          // Si las habilidades vienen como string de Django, las convertimos a array
          habilidades: datos.habilidades ? datos.habilidades.split(',').map((h: string) => h.trim()) : []
        });
      },
      error: (err) => {
        console.error('Error al traer datos de Django:', err);
      }
    });
  }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  // FUNCIÓN QUE RECIBE Y PROCESA LOS 3 DATOS DEL MODAL
  guardarPerfil(datos: { telefono: string, equipo: string, habilidades: string }) {

    // 1. Preparamos el paquete de datos que le enviaremos a Django (solo lo que no esté vacío)
    const datosParaBackend: any = {};
    if (datos.telefono.trim() !== '') datosParaBackend.telefono = datos.telefono;
    if (datos.equipo.trim() !== '') datosParaBackend.equipoRegistrado = datos.equipo;
    // Si tienes un campo de habilidades en tu modelo de Django, también lo agregamos:
    if (datos.habilidades.trim() !== '') datosParaBackend.habilidades = datos.habilidades;

    // 2. Enviamos la petición al backend
    this.authService.actualizarPerfil(datosParaBackend).subscribe({
      next: (respuestaBackend) => {
        console.log('¡Perfil actualizado en la base de datos!', respuestaBackend);

        // 3. Si todo salió bien en la base de datos, actualizamos lo que ve el usuario en pantalla
        this.perfilData.update(perfilActual => {
          let listaHabilidades = perfilActual.habilidades;
          if (datos.habilidades.trim() !== '') {
            listaHabilidades = datos.habilidades.split(',').map(h => h.trim());
          }

          return {
            ...perfilActual,
            telefono: datos.telefono !== '' ? datos.telefono : perfilActual.telefono,
            equipoRegistrado: datos.equipo !== '' ? datos.equipo : perfilActual.equipoRegistrado,
            habilidades: listaHabilidades
          };
        });

        this.cerrarModal(); // Cerramos la ventana
      },
      error: (error) => {
        console.error('Hubo un error al actualizar el perfil en Django:', error);
        alert('No se pudo actualizar el perfil. Revisa tu conexión.');
      }
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  }
}
