// Mejora general del componente de reservas, con enfoque en claridad, mantenibilidad y experiencia de usuario.
// Se agregan validaciones de autenticación, manejo de errores más robusto y una mejor estructura de datos para las reservas.
import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaModal } from '../components/reserva-modal/reserva-modal';
import { ReservaService, ReservaPayload } from '../../../core/services/reserva';
import { NotificationService } from '../../../core/services/notification';

//  Tipos e interfaces 

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

//  Componente 

@Component({
  selector: 'app-reservas-dashboard',
  standalone: true,
  imports: [ReservaModal],
  templateUrl: './reservas-dashboard.html',
  styleUrl: './reservas-dashboard.scss',
})
export class ReservasDashboard {

  //  Servicios 
  private readonly reservaService = inject(ReservaService);
  private readonly notifService   = inject(NotificationService);
  private readonly router         = inject(Router); // Para redirección en caso de error de autenticación

  //  Estado del calendario 
  vista       = signal<VistaCalendario>('semanal');
  semanaBase  = signal<Date>(this.getLunes(new Date()));
  diaSeleccionado = signal<Date>(new Date());

  //  Estado del modal 
  mostrarModal = signal(false);
  slotActivo   = signal<SlotActivo | null>(null);

  //  Estado del servicio (reactivo) 
  cargando = this.reservaService.loading;
  errorApi = this.reservaService.error;

  //  Constantes 
  readonly horas = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  ];

  readonly nombresDias = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  // Disponibilidad 7 días × 11 horas (true = libre)
  disponibilidad = signal<boolean[][]>(
    Array.from({ length: 7 }, () => Array(11).fill(true))
  );

  //  Computeds del calendario 

  diasSemana = computed<DiaCalendario[]>(() => {
    const lunes = this.semanaBase();
    return this.nombresDias.map((nombre, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      return { nombre, numero: fecha.getDate(), fecha };
    });
  });

  // Etiqueta del mes y año en la vista semanal o diaria
  mesAnioLabel = computed(() => {
    const base =
      this.vista() === 'semanal'
        ? this.semanaBase()
        : this.diaSeleccionado();
    return base.toLocaleDateString('es-MX', {
      month: 'long',
      year: 'numeric',
    });
  });

  // Etiqueta del día seleccionado en la vista diaria
  fechaDiariaLabel = computed(() =>
    this.diaSeleccionado().toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  );

  diaSeleccionadoIndex = computed(() => {
    const selec = this.diaSeleccionado();
    return this.diasSemana().findIndex(
      (d) => d.fecha.toDateString() === selec.toDateString() // Si no encuentra el día, retorna -1 (aunque debería estar siempre)
    );
  });

  horariosDelDia = computed<SlotDiario[]>(() => {
    const diaIdx = this.diaSeleccionadoIndex();
    const disp   = this.disponibilidad();
    return this.horas.map((hora, horaIdx) => ({
      hora,
      rango:      `${hora} - ${this.getHoraFin(hora)}`, 
      disponible: diaIdx >= 0 ? (disp[diaIdx]?.[horaIdx] ?? true) : true,
      horaIdx,
    }));
  });

  //  Navegación del calendario 

  irAnterior(): void {
    if (this.vista() === 'semanal') {
      const nueva = new Date(this.semanaBase());
      nueva.setDate(nueva.getDate() - 7);
      this.semanaBase.set(nueva);
    } else {
      const nueva = new Date(this.diaSeleccionado());
      nueva.setDate(nueva.getDate() - 1);
      this.diaSeleccionado.set(nueva);
      // Si el nuevo día no está en la semana actual, ajustamos la semana base para mostrarlo
      if (
        !this.diasSemana().some(
          (d) => d.fecha.toDateString() === nueva.toDateString()
        )
      ) {
        this.semanaBase.set(this.getLunes(nueva));
      }
    }
  }

  // Avanza al siguiente día o semana, dependiendo de la vista actual.
  irSiguiente(): void {
    if (this.vista() === 'semanal') {
      const nueva = new Date(this.semanaBase());
      nueva.setDate(nueva.getDate() + 7);
      this.semanaBase.set(nueva);
    } else {
      const nueva = new Date(this.diaSeleccionado());
      nueva.setDate(nueva.getDate() + 1);
      this.diaSeleccionado.set(nueva);
      if (
        !this.diasSemana().some(
          (d) => d.fecha.toDateString() === nueva.toDateString()
        )
      ) {
        this.semanaBase.set(this.getLunes(nueva));
      }
    }
  }

  cambiarVista(v: VistaCalendario): void { // Cambia entre vista semanal y diaria. 
    this.vista.set(v);
  }

  // Selecciona un día específico para mostrar su vista diaria.
  seleccionarDiaParaDiario(diaIdx: number): void {
    this.diaSeleccionado.set(this.diasSemana()[diaIdx].fecha);
    this.vista.set('diario');
  }

  //  Selección de slots 

  seleccionarSlotSemanal(diaIdx: number, horaIdx: number): void {
    if (!this.estaDisponible(diaIdx, horaIdx)) return;

    // Verificamos autenticación antes de abrir el modal
    if (!this.reservaService.verificarAutenticacion()) {
      this.notifService.error(
        'Tu sesión ha expirado. Redirigiendo al login...'
      );
      setTimeout(() => this.router.navigate(['/login-reserva']), 1500);
      return;
    }

    const dia  = this.diasSemana()[diaIdx];
    const hora = this.horas[horaIdx];

    this.slotActivo.set({
      fecha: dia.fecha,
      hora,
      fechaDisplay: dia.fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      diaIdx,
      horaIdx,
    });
    this.mostrarModal.set(true);
  }

  seleccionarSlotDiario(slot: SlotDiario): void {
    if (!slot.disponible) return;

    // Verificamos autenticación antes de abrir el modal
    if (!this.reservaService.verificarAutenticacion()) {
      this.notifService.error(
        'Tu sesión ha expirado. Redirigiendo al login...'
      );
      setTimeout(() => this.router.navigate(['/login-reserva']), 1500);
      return;
    }

    const diaIdx = this.diaSeleccionadoIndex();
    if (diaIdx < 0) return;

    // El slot diario ya tiene la hora, solo falta agregar la fecha del día seleccionado.
    const d = this.diaSeleccionado();
    this.slotActivo.set({
      fecha: d,
      hora:  slot.hora,
      fechaDisplay: d.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      diaIdx,
      horaIdx: slot.horaIdx,
    });
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.slotActivo.set(null);
  }

  //  Procesamiento de reserva 

  
  // Recibe los datos del modal, construye el payload tipado y lo envía al backend a través del ReservaService.
  procesarReserva(datosModal: any): void {
    const slot = this.slotActivo();
    if (!slot) return;

    // Construimos el payload con tipado fuerte
    const payload: ReservaPayload = {
      laboratorio: datosModal.laboratorio,
      fecha:       this.formatearFecha(slot.fecha),
      hora_inicio: slot.hora,
      duracion:    datosModal.duracion,
      // Campo de compatibilidad con el backend actual de Erick
      equipo:      datosModal.equipo,
      // Lista detallada de equipos seleccionados
      equipos:     datosModal.equipos ?? [],
      proposito:   datosModal.proposito,
    };

    this.reservaService.crearReserva(payload).subscribe({
      next: (respuesta) => {
        if (respuesta !== null) {
          // ✅ Reserva exitosa
          this.notifService.exito(
            `¡Reserva #${this.reservaService.ultimaReservaId()} confirmada con éxito!`
          );
          this.mostrarModal.set(false);
          this.marcarSlotOcupado(slot.diaIdx, slot.horaIdx);
          this.slotActivo.set(null);
        } else {
          // ❌ Error controlado (ya seteado en el servicio)
          const mensajeError =
            this.errorApi() ?? 'Error al procesar la reserva. Intenta de nuevo.';
          this.notifService.error(mensajeError);

          // Si el error es de autenticación, redirigimos al login
          if (
            mensajeError.includes('sesión') ||
            mensajeError.includes('expirad')
          ) {
            setTimeout(() => this.router.navigate(['/login-reserva']), 2000);
          }
        }
      },
    });
  }

  //  Helpers 

  estaDisponible(diaIdx: number, horaIdx: number): boolean {
    return this.disponibilidad()[diaIdx]?.[horaIdx] ?? true;
  }

  private marcarSlotOcupado(diaIdx: number, horaIdx: number): void {
    this.disponibilidad.update((disp) => {
      const copia = disp.map((dia) => [...dia]);
      copia[diaIdx][horaIdx] = false;
      return copia;
    });
  }

  private getLunes(fecha: Date): Date {
    const d    = new Date(fecha);
    const dia  = d.getDay();
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