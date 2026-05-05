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

  // Asegúrate de tener la función gestionarSolicitud que hicimos antes:
  gestionarSolicitud(id: number | undefined, nuevoEstado: string) {
    if (!id) return;

    this.equipoService.actualizarEstadoPrestamo(id, nuevoEstado).subscribe({
      next: () => {
        // 1. Personalizamos el mensaje según la acción realizada
        let msg = '';
        switch (nuevoEstado) {
          case 'Aprobado':
            msg = 'Préstamo aprobado';
            break;
          case 'Rechazado':
            msg = 'Solicitud rechazada';
            break;
          case 'Devuelto':
            msg = 'Equipo recibido y stock actualizado'; // Mensaje para el botón Recibir
            break;
          default:
            msg = `Estado actualizado a ${nuevoEstado}`;
        }

        this.notifService.exito(`${msg} correctamente.`);

        // 2. Recargamos los datos (esto moverá el ítem de la lista de Devoluciones a la nada/historial)
        this.cargarDatos();

        // 3. Si el modal está abierto (usado en aprobaciones), lo cerramos
        if (this.isModalOpen()) {
          this.cerrarModal();
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.notifService.error('Error al actualizar el estado en el servidor.');
      }
    });
  }

}
