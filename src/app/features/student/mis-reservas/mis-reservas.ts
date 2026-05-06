import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../core/services/reserva'; // Verifica la ruta de importación

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss'
})
export class MisReservasComponent implements OnInit {

  // Inyección del servicio
  private readonly reservaService = inject(ReservaService);

  // Signals para manejar el estado de la vista
  misReservas = signal<any[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarMisReservas();
  }

cargarMisReservas() {
    this.cargando.set(true);

    this.reservaService.obtenerMisReservas().subscribe({
      next: (data: any) => {
        let reservas = data.results || data;

        // Obtenemos la fecha y hora actual
        const ahora = new Date();

        // Evaluamos cada reserva para ver si ya pasó
        reservas = reservas.map((r: any) => {
          // Creamos un objeto Date combinando la fecha y la hora de fin de la reserva
          // Ej: "2026-05-05T10:00:00"
          const fechaFinReserva = new Date(`${r.fecha}T${r.hora_fin}`);

          let estadoDisplay = r.estado;

          // Si estaba aprobada pero la fecha/hora de fin ya pasó, la marcamos como Expiró
          if (r.estado === 'Aprobada' && fechaFinReserva < ahora) {
            estadoDisplay = 'Expiró';
          }

          return { ...r, estadoDisplay };
        });

        this.misReservas.set(reservas);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('No se pudieron cargar las reservas:', err);
        this.cargando.set(false);
      }
    });
  }
}
