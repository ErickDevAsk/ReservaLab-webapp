import { Component, signal, inject } from '@angular/core'; //añadimos inject para usar servicios en el futuro
import { CommonModule } from '@angular/common';
import { ReservaModal } from '../components/reserva-modal/reserva-modal'; //importamos el modal para usarlo en la plantilla
import { ReservaService } from '../../../core/services/reserva'; //importamos el servicio de reservas para usarlo en el futuro

@Component({
  selector: 'app-reservas-dashboard',
  standalone: true,
  //agremos el modal a los imports para poder usarlo en la plantilla
  imports: [CommonModule, ReservaModal],
  templateUrl: './reservas-dashboard.html',
  styleUrl: './reservas-dashboard.scss',
})

export class ReservasDashboard {
slotSeleccionado(): string {
throw new Error('Method not implemented.');
}

  //inyectamos el servicio de reservas
  private readonly reservaService = inject(ReservaService); 

  // Señales para el estado de la vista
  public mesAnio = signal<string>('marzo 2026');
  public fechaVisual = signal<string>('domingo, 22 de marzo');

  // Estado del modal
  public mostrarModal = signal<boolean>(false);
  public horaSeleccionada = signal<string>('');

  //Exportamos el estado del servicio para usarlo en el html 
  public cargando = this.reservaService.loading;
  public errorApi = this.reservaService.error;

  // Listado dinámico de horarios (simulado por ahora)
  public horarioSlots = signal([
    { hora: '08:00 - 09:00', disponible: true },
    { hora: '09:00 - 10:00', disponible: true },
    { hora: '10:00 - 11:00', disponible: true },
    { hora: '11:00 - 12:00', disponible: true },
    { hora: '12:00 - 13:00', disponible: true },
    { hora: '13:00 - 14:00', disponible: true },
    { hora: '14:00 - 15:00', disponible: true },
    { hora: '15:00 - 16:00', disponible: true },
    { hora: '16:00 - 17:00', disponible: true },
    { hora: '17:00 - 18:00', disponible: true },
    { hora: '18:00 - 19:00', disponible: true },
  ]);
  

  /**
   * Maneja el clic en un horario disponible
   */

  seleccionarSlot(slot: any) {
    if (slot.disponible) {
      console.log(`Iniciando reserva para el bloque: ${slot.hora}`);
      this.horaSeleccionada.set(slot.hora); //Guardamos la hora seleccionada para pasarla al modal
      this.mostrarModal.set(true); //Abrimos el modal
    }
  }
  
  cerrarModal() {
    this.mostrarModal.set(false);
  }

  /*
    aqui es donde se conectara el backend
  */

  procesarReserva(datosDelModal: any) {
    console.log('Iniciando envío a Django con datos:', datosDelModal);

    // 1. Preparamos el objeto final (JSON) que se enviará al backend
    const reservaFinal = {
      laboratorio: 'Laboratorio de Redes', // Sera dinamico en el futuro, por ahora lo dejamos fijo
      fecha: '2026-03-22',                // Fecha actual del dashboard
      hora_inicio: datosDelModal.hora_inicio,
      duracion: datosDelModal.duracion,
      equipo: datosDelModal.equipo,
      proposito: datosDelModal.proposito
    };

    //Llamamos al servicio (ReservaService)
    this.reservaService.crearReserva(reservaFinal).subscribe({
      next: (respuesta) => {
        // Si el backend responde con éxito:
        console.log('¡Reserva confirmada en la DB!', respuesta);
        
        // Cerramos el modal inmediatamente
        this.mostrarModal.set(false);

        // Feedback al usuario
        alert('¡Tu reserva ha sido confirmada con éxito!');

        //ACTUALIZACIÓN REACTIVA (Cambio visual a "Ocupado")
        this.horarioSlots.update(slots => 
          slots.map(s => 
            s.hora === datosDelModal.hora_inicio 
              ? { ...s, disponible: false } 
              : s
          )
        );
      },
      error: (err) => {
        // El error ya se guarda en el signal 'errorApi' del servicio, 
        // pero aquí podemos dar un aviso extra.
        console.error('Error al intentar reservar:', err);
        alert('Hubo un problema con el servidor. Revisa la consola.');
      }
    });
  }
  private actualizarSlotlocal(hora: string) {
    this.horarioSlots.update(slots => 
      slots.map(slot => slot.hora === hora ? { ...slot, disponible: false } : slot)
    );
  }
  
}
