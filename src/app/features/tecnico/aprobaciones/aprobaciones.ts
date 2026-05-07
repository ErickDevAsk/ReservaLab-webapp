import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoService } from '../../../core/services/equipo'; // Ajusta la ruta según tu carpeta
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aprobaciones.html',
  styleUrl: './aprobaciones.scss',
})
export class Aprobaciones implements OnInit {
  private equipoService = inject(EquipoService);
  private notifService = inject(NotificationService);

  // Usamos Signals para que la tabla reaccione rápido a los cambios
  solicitudes = signal<any[]>([]);
  devoluciones = signal<any[]>([]);
  vencidos = signal<any[]>([]);

  isModalOpen = signal(false);
  solicitudSeleccionada = signal<any>(null);

  //  Signals para el Modal de Recepción / Incidencias
  mostrarModalRecibir = signal(false);
  modoDano = signal(false); // false = Pregunta si todo bien, true = Formulario de daño
  solicitudActiva = signal<any>(null);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.equipoService.getTodasLasSolicitudes().subscribe({
      next: (data) => {
        const hoy = new Date();

        // 🔵 Pendientes de aprobación (Asegúrate que en Django el default sea 'Pendiente')
        this.solicitudes.set(data.filter(d => d.estado.toLowerCase() === 'pendiente' || d.estado === 'En curso'));

        // 🟡 Préstamos activos (Ya entregados al alumno)
        this.devoluciones.set(data.filter(d => d.estado.toLowerCase() === 'activo' || d.estado === 'Aprobado'));

        // 🔴 Préstamos que ya pasaron su fecha de devolución
        this.vencidos.set(data.filter(d =>
          d.estado !== 'Devuelto' && new Date(d.fecha_devolucion_prevista) < hoy
        ));
      },
      error: (err) => {
        this.notifService.error('No se pudieron cargar las solicitudes del servidor.');
      }
    });
  }

  /**
   * Acciónes para que el técnico apruebe la entrega del equipo
   */
  // Función para abrir el modal
  abrirModal(solicitud: any) {
    this.solicitudSeleccionada.set(solicitud);
    this.isModalOpen.set(true);
  }

  // Función para cerrar el modal
  cerrarModal() {
    this.isModalOpen.set(false);
    this.solicitudSeleccionada.set(null);
  }


  // MODAL DE RECEPCIÓN E INCIDENCIAS
  abrirModalRecibir(solicitud: any) {
    this.solicitudActiva.set(solicitud);
    this.modoDano.set(false); // Siempre empezamos con la pregunta initial
    this.mostrarModalRecibir.set(true);
  }

  cerrarModalRecibir() {
    this.mostrarModalRecibir.set(false);
    this.solicitudActiva.set(null);
  }

  confirmarRecepcionBuena() {
    const sol = this.solicitudActiva();
    if (sol) {
      // Reutilizamos la función base marcándolo como devuelto (suma stock normal)
      this.gestionarSolicitud(sol.id, 'Devuelto');
      this.cerrarModalRecibir();
    }
  }

  registrarDanoEquipo(descripcion: string) {
    const sol = this.solicitudActiva();
    if (!sol || !descripcion.trim()) {
      this.notifService.error('Por favor, escribe una descripción del daño.');
      return;
    }

    // OJO: Asegúrate de que "sol.equipo" contenga el ID del equipo en tu JSON.
    // Si tu serializer devuelve el ID en "sol.equipo_id", cámbialo aquí.
    const payload = {
      equipo: sol.equipo,
      descripcion: descripcion
    };

    this.equipoService.registrarIncidencia(payload).subscribe({
      next: () => {
        // Marcamos la solicitud de préstamo como 'Con Incidencia'
        this.gestionarSolicitud(sol.id, 'Con Incidencia');
        // El notifService se maneja desde gestionarSolicitud, pero cerramos el modal aquí
        this.cerrarModalRecibir();
      },
      error: (err) => {
        console.error(err);
        this.notifService.error('Hubo un error al guardar el reporte en la base de datos.');
      }
    });
  }

  // GESTIÓN CENTRALIZADA DE ESTADOS
  gestionarSolicitud(id: number | undefined, nuevoEstado: string) {
    if (!id) return;

    this.equipoService.actualizarEstadoPrestamo(id, nuevoEstado).subscribe({
      next: () => {
        let msg = '';
        switch (nuevoEstado) {
          case 'Aprobado':
            msg = 'Préstamo aprobado';
            break;
          case 'Rechazado':
            msg = 'Solicitud rechazada';
            break;
          case 'Devuelto':
            msg = 'Equipo recibido y stock actualizado';
            break;
          case 'Con Incidencia':
            msg = 'Daño registrado. El equipo ha sido bloqueado del inventario';
            break;
          default:
            msg = `Estado actualizado a ${nuevoEstado}`;
        }

        this.notifService.exito(`${msg} correctamente.`);
        this.cargarDatos();

        // Cerramos modal de aprobación si estaba abierto
        if (this.isModalOpen()) this.cerrarModal();
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.notifService.error('Error al actualizar el estado en el servidor.');
      }
    });
  }
}


