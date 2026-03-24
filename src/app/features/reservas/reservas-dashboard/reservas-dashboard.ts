import { Component, signal, computed, inject } from '@angular/core'; //agregamos inject y computed
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; //agregamos Router para navegación
import { ReservaModal } from '../components/reserva-modal/reserva-modal'; //importamos el modal
import { ReservaService } from '../../../core/services/reserva'; //importamos el servicio de reservas para manejar la lógica de backend
import { NotificationService } from '../../../core/services/notification'; //importamos el servicio de notificaciones para mostrar mensajes visuales al usuario

//Interfaces y tipos relacionados con la vista y selección de slots
export type VistaCalendario = 'semanal' | 'diario';

export interface SlotActivo {
  fecha: Date;
  hora: string;
  fechaDisplay: string;
  diaIdx: number;
  horaIdx: number;
}

export interface DiaCalendario {
  nombre: string;
  numero: number;
  fecha: Date;
}

export interface SlotDiario {
  hora: string;
  rango: string;
  disponible: boolean;
  horaIdx: number;
}

// Componente principal del dashboard de reservas
@Component({
  selector: 'app-reservas-dashboard',
  standalone: true,
  imports: [CommonModule, ReservaModal],
  templateUrl: './reservas-dashboard.html',
  styleUrl: './reservas-dashboard.scss',
})

export class ReservasDashboard {

  // Servicios
  private readonly router         = inject(Router);
  private readonly reservaService = inject(ReservaService);
  private readonly notifService   = inject(NotificationService);

  // Sidebar
  sidebarCollapsed = signal(false);

  // Vista activa
  vista = signal<VistaCalendario>('semanal');

  // Semana base = lunes de la semana actual
  semanaBase = signal<Date>(this.getLunes(new Date()));

  // Día seleccionado para vista diaria
  diaSeleccionado = signal<Date>(new Date());

  // Modal
  mostrarModal = signal(false);
  slotActivo   = signal<SlotActivo | null>(null);

  // Estado del servicio
  cargando = this.reservaService.loading;
  errorApi = this.reservaService.error;

  // Horas del día
  readonly horas = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  readonly nombresDias = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  // Disponibilidad 7 días x 11 horas (todas disponibles inicialmente)
  disponibilidad = signal<boolean[][]>(
    Array.from({ length: 7 }, () => Array(11).fill(true))
  );

  // Computed para generar los datos de la vista semanal y diaria
  diasSemana = computed<DiaCalendario[]>(() => {
    const lunes = this.semanaBase();
    return this.nombresDias.map((nombre, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      return { nombre, numero: fecha.getDate(), fecha };
    });
  });

  mesAnioLabel = computed(() => {
    const base = this.vista() === 'semanal'
      ? this.semanaBase()
      : this.diaSeleccionado();
    return base.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  });

  fechaDiariaLabel = computed(() =>
    this.diaSeleccionado().toLocaleDateString('es-MX', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
  );

  diaSeleccionadoIndex = computed(() => {
    const selec = this.diaSeleccionado();
    return this.diasSemana().findIndex(
      d => d.fecha.toDateString() === selec.toDateString()
    );
  });

  horariosDelDia = computed<SlotDiario[]>(() => {
    const diaIdx = this.diaSeleccionadoIndex();
    const disp   = this.disponibilidad();
    return this.horas.map((hora, horaIdx) => ({
      hora,
      rango: `${hora} - ${this.getHoraFin(hora)}`,
      disponible: diaIdx >= 0 ? (disp[diaIdx]?.[horaIdx] ?? true) : true,
      horaIdx
    }));
  });

  // Navegación del calendario (semanal y diario)
  irAnterior() {
    if (this.vista() === 'semanal') {
      const nueva = new Date(this.semanaBase());
      nueva.setDate(nueva.getDate() - 7);
      this.semanaBase.set(nueva);
    } else {
      const nueva = new Date(this.diaSeleccionado());
      nueva.setDate(nueva.getDate() - 1);
      this.diaSeleccionado.set(nueva);
      if (!this.diasSemana().some(d => d.fecha.toDateString() === nueva.toDateString())) {
        this.semanaBase.set(this.getLunes(nueva));
      }
    }
  }

  irSiguiente() {
    if (this.vista() === 'semanal') {
      const nueva = new Date(this.semanaBase());
      nueva.setDate(nueva.getDate() + 7);
      this.semanaBase.set(nueva);
    } else {
      const nueva = new Date(this.diaSeleccionado());
      nueva.setDate(nueva.getDate() + 1);
      this.diaSeleccionado.set(nueva);
      if (!this.diasSemana().some(d => d.fecha.toDateString() === nueva.toDateString())) {
        this.semanaBase.set(this.getLunes(nueva));
      }
    }
  }

  // Cambio de vista
  cambiarVista(v: VistaCalendario) {
    this.vista.set(v);
  }

  // Click en encabezado de día (semanal) → ir a vista diaria de ese día
  seleccionarDiaParaDiario(diaIdx: number) {
    this.diaSeleccionado.set(this.diasSemana()[diaIdx].fecha);
    this.vista.set('diario');
  }

  // Selección de slots y manejo del modal
  seleccionarSlotSemanal(diaIdx: number, horaIdx: number) {
    if (!this.estaDisponible(diaIdx, horaIdx)) return;

    const dia  = this.diasSemana()[diaIdx];
    const hora = this.horas[horaIdx];

    this.slotActivo.set({
      fecha: dia.fecha,
      hora,
      fechaDisplay: dia.fecha.toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }),
      diaIdx,
      horaIdx
    });
    this.mostrarModal.set(true);
  }

  seleccionarSlotDiario(slot: SlotDiario) {
    if (!slot.disponible) return;

    const diaIdx = this.diaSeleccionadoIndex();
    if (diaIdx < 0) return;

    const d = this.diaSeleccionado();
    this.slotActivo.set({
      fecha: d,
      hora: slot.hora,
      fechaDisplay: d.toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }),
      diaIdx,
      horaIdx: slot.horaIdx
    });
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.slotActivo.set(null);
  }

  // Procesar reserva desde el modal → llamada al servicio de reservas y manejo de respuesta
  procesarReserva(datos: any) {
    const slot = this.slotActivo();
    if (!slot) return;

    const reservaFinal = {
      laboratorio: datos.laboratorio,
      fecha: this.formatearFecha(slot.fecha),
      hora_inicio: slot.hora,
      duracion: datos.duracion,
      equipo: datos.equipo,
      proposito: datos.proposito
    };

    this.reservaService.crearReserva(reservaFinal).subscribe({
      next: (respuesta) => {
        if (respuesta !== null) {
          this.notifService.exito('¡Tu reserva ha sido confirmada con éxito!');
          this.mostrarModal.set(false);
          this.marcarSlotOcupado(slot.diaIdx, slot.horaIdx);
          this.slotActivo.set(null);
        } else {
          const msg = this.errorApi() ?? 'Error al procesar la reserva. Intenta de nuevo.';
          this.notifService.error(msg);
        }
      }
    });
  }

  // Sidebar y routing 
  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  irADashboard() { this.router.navigate(['/student-dashboard']); }
  irALanding()   { this.router.navigate(['/']); }

  cerrarSesion() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

  // Helpers
  estaDisponible(diaIdx: number, horaIdx: number): boolean {
    return this.disponibilidad()[diaIdx]?.[horaIdx] ?? true;
  }

  private marcarSlotOcupado(diaIdx: number, horaIdx: number) {
    this.disponibilidad.update(disp => {
      const copia = disp.map(dia => [...dia]);
      copia[diaIdx][horaIdx] = false;
      return copia;
    });
  }

  private getLunes(fecha: Date): Date {
    const d   = new Date(fecha);
    const dia = d.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  private getHoraFin(hora: string): string {
    const [hh, mm] = hora.split(':').map(Number);
    return `${String(hh + 1).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
}