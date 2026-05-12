import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TecnicoService,
  PerfilTecnico,
  ActividadTecnico,
} from '../../../core/services/tecnico';
import { NotificationService } from '../../../core/services/notification';
import { AuthService } from '../../../core/services/auth';
// Tabs disponibles en la vista de perfil
type TabActivo = 'info' | 'historial';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {

  //  Servicios
  private readonly tecnicoService = inject(TecnicoService);
  private readonly notifService   = inject(NotificationService);
  private readonly authService    = inject(AuthService);

  //  Estado del perfil
  perfil         = signal<PerfilTecnico | null>(null);
  actividad      = signal<ActividadTecnico[]>([]);
  cargandoPerfil = this.tecnicoService.loading;
  errorPerfil    = this.tecnicoService.error;

  //  Estado de la UI
  tabActivo        = signal<TabActivo>('info');
  guardando        = signal<boolean>(false);
  cargandoHistorial = signal<boolean>(false);
  modoEdicion      = signal<boolean>(false);

  //  Formulario de edición (copia del perfil)
  formData = signal<Partial<PerfilTecnico>>({});

  //  Computeds
  /** Cargar el rol */
  etiquetaRol = computed(() => {
    const rol = this.perfil()?.rol?.toLowerCase();
    if (rol === 'administrador') return 'Administrador del Sistema';
    if (rol === 'tecnico') return 'Personal Técnico';
    return 'Staff ReservaLab';
  });

  /** Iniciales del nombre para el avatar */
  inicialesAvatar = computed(() => {
    const p = this.perfil();
    if (!p) return 'T';
    const partes = `${p.first_name} ${p.last_name}`.trim().split(' ');
    return partes
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? '')
      .join('');
  });

  /** Nombre completo del técnico */
  nombreCompleto = computed(() => {
    const p = this.perfil();
    if (!p) return 'Técnico';
    return `${p.first_name} ${p.last_name}`.trim();
  });

  /** Total de actividades positivas (aprobaciones + devoluciones) */
  totalAprobaciones = computed(() =>
    this.actividad().filter(
      (a) => a.tipo === 'aprobacion' || a.tipo === 'devolucion'
    ).length
  );

  /** Total de rechazos e incidencias */
  totalIncidencias = computed(() =>
    this.actividad().filter(
      (a) => a.tipo === 'rechazo' || a.tipo === 'incidencia'
    ).length
  );

  //  Lifecycle

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarHistorial();
  }

  //  Carga de datos

  cargarPerfil(): void {
    this.authService.obtenerPerfil().subscribe({
      next: (datos) => {
        this.perfil.set(datos);
        // Inicializamos el formulario con los datos actuales
        this.formData.set({ ...datos });
      },
      error: () => {
        this.notifService.error('No se pudo cargar la información del perfil.');
      },
    });
  }

  cargarHistorial(): void {
    this.cargandoHistorial.set(true);
    this.tecnicoService.getActividadReciente().subscribe({
      next: (datos) => {
        this.actividad.set(datos);
        this.cargandoHistorial.set(false);
      },
      error: () => {
        this.cargandoHistorial.set(false);
        this.notifService.advertencia(
          'No se pudo cargar el historial de actividades.'
        );
      },
    });
  }

  //  Control de tabs

  cambiarTab(tab: TabActivo): void {
    this.tabActivo.set(tab);
    // Si se cierra la edición al cambiar de tab
    if (tab !== 'info') {
      this.modoEdicion.set(false);
    }
  }

  //  Control de edición

  activarEdicion(): void {
    // Recargamos el formulario con los datos actuales antes de editar
    this.formData.set({ ...this.perfil() });
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    // Reseteamos los cambios no guardados
    this.formData.set({ ...this.perfil() });
  }

  guardarCambios(): void {
    const datos = this.formData();

    if (!datos.first_name?.trim() || !datos.last_name?.trim()) {
      this.notifService.advertencia('El nombre y apellido son obligatorios.');
      return;
    }

    if (!datos.email?.includes('@')) {
      this.notifService.advertencia('Por favor ingresa un correo electrónico válido.');
      return;
    }

    this.guardando.set(true);

    // Petición real al backend
    this.authService.actualizarPerfil(datos).subscribe({
      next: (perfilActualizado: any) => {
        this.perfil.set(perfilActualizado);
        this.modoEdicion.set(false);
        this.guardando.set(false);
        this.notifService.exito('Perfil actualizado correctamente.');

        // Opcional: Si el usuario cambió su nombre, actualizamos el token/localStorage
        // para que el Sidebar se actualice automáticamente.
      },
      error: (err: any) => {
        this.guardando.set(false);
        this.notifService.error('Ocurrió un error al actualizar el perfil.');
        console.error(err);
      }
    });
  }

  //  Helpers del historial

  /** Retorna la clase CSS del ícono según el tipo de actividad */
  getIconoClase(tipo: ActividadTecnico['tipo']): string {
    const clases: Record<ActividadTecnico['tipo'], string> = {
      aprobacion: 'bg-green-100 text-green-600',
      devolucion: 'bg-blue-100 text-blue-600',
      rechazo:    'bg-red-100 text-red-500',
      incidencia: 'bg-yellow-100 text-yellow-600',
    };
    return clases[tipo] ?? 'bg-slate-100 text-slate-500';
  }

  /** Retorna el label en español del tipo de actividad */
  getTipoLabel(tipo: ActividadTecnico['tipo']): string {
    const labels: Record<ActividadTecnico['tipo'], string> = {
      aprobacion: 'Aprobación',
      devolucion: 'Devolución',
      rechazo:    'Rechazo',
      incidencia: 'Incidencia',
    };
    return labels[tipo] ?? tipo;
  }

  /** Retorna la clase del badge del tipo de actividad */
  getBadgeClase(tipo: ActividadTecnico['tipo']): string {
    const clases: Record<ActividadTecnico['tipo'], string> = {
      aprobacion: 'bg-green-50 text-green-700 border-green-200',
      devolucion: 'bg-blue-50 text-blue-700 border-blue-200',
      rechazo:    'bg-red-50 text-red-600 border-red-200',
      incidencia: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    return clases[tipo] ?? 'bg-slate-50 text-slate-600 border-slate-200';
  }

  /** Formatea la fecha ISO a formato legible en español */
  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString('es-MX', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  }

  /** Actualiza un campo del formulario (helper para el template) */
  actualizarCampo(campo: keyof PerfilTecnico, valor: string): void {
    this.formData.update((f) => ({ ...f, [campo]: valor }));
  }
}
