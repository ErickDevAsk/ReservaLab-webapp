import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Perfil } from './perfil';
import { TecnicoService, PerfilTecnico, ActividadTecnico } from '../../../core/services/tecnico';
import { NotificationService } from '../../../core/services/notification';
import { of } from 'rxjs';

// Mock del perfil técnico para tests
const mockPerfil: PerfilTecnico = {
  id:                   1,
  username:             'tecnico01',
  first_name:           'Carlos',
  last_name:            'Ramírez López',
  email:                'c.ramirez@buap.mx',
  matricula_id:         '20241056',
  carrera_departamento: 'Soporte Técnico - FCC',
  rol:                  'tecnico',
};

// Mock del historial de actividades
const mockActividad: ActividadTecnico[] = [
  {
    id:          1,
    tipo:        'aprobacion',
    descripcion: 'Reserva de Laboratorio aprobada',
    fecha:       '2026-04-15T10:30:00',
    usuario:     'Christian M.',
    equipo:      'Microscopio Óptico',
  },
  {
    id:          2,
    tipo:        'incidencia',
    descripcion: 'Incidencia reportada: equipo dañado',
    fecha:       '2026-04-14T09:00:00',
    equipo:      'Centrifugadora',
  },
];

describe('Perfil (Técnico)', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;
  let tecnicoService: TecnicoService;
  let notifService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
    }).compileComponents();

    tecnicoService = TestBed.inject(TecnicoService);
    notifService   = TestBed.inject(NotificationService);

    // Espiamos los métodos del servicio retornando mocks
    vi.spyOn(tecnicoService, 'getMiPerfil').mockReturnValue(of(mockPerfil));
    vi.spyOn(tecnicoService, 'getActividadReciente').mockReturnValue(of(mockActividad));

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar en el tab de información personal', () => {
    expect(component.tabActivo()).toBe('info');
  });

  it('debería cargar el perfil desde el servicio en ngOnInit', () => {
    expect(tecnicoService.getMiPerfil).toHaveBeenCalled();
    expect(component.perfil()).toEqual(mockPerfil);
  });

  it('debería calcular correctamente las iniciales del avatar', () => {
    // "Carlos Ramírez" → "CR"
    expect(component.inicialesAvatar()).toBe('CR');
  });

  it('debería calcular correctamente el nombre completo', () => {
    expect(component.nombreCompleto()).toBe('Carlos Ramírez López');
  });

  it('debería contar correctamente las aprobaciones', () => {
    // Solo hay 1 actividad de tipo aprobacion
    expect(component.totalAprobaciones()).toBe(1);
  });

  it('debería contar correctamente las incidencias', () => {
    // Solo hay 1 actividad de tipo incidencia
    expect(component.totalIncidencias()).toBe(1);
  });

  it('debería cambiar al tab de historial correctamente', () => {
    component.cambiarTab('historial');
    expect(component.tabActivo()).toBe('historial');
  });

  it('debería activar el modo edición', () => {
    expect(component.modoEdicion()).toBe(false);
    component.activarEdicion();
    expect(component.modoEdicion()).toBe(true);
  });

  it('debería cancelar la edición y resetear formData', () => {
    component.activarEdicion();
    component.actualizarCampo('first_name', 'NombreCambiado');
    component.cancelarEdicion();

    expect(component.modoEdicion()).toBe(false);
    // El formData debe volver al perfil original
    expect(component.formData().first_name).toBe('Carlos');
  });

  it('NO debería guardar si el nombre está vacío', () => {
    const notifSpy = vi.spyOn(notifService, 'advertencia');
    component.activarEdicion();
    component.actualizarCampo('first_name', '');
    component.guardarCambios();
    expect(notifSpy).toHaveBeenCalledWith(
      'El nombre y apellido son obligatorios.'
    );
  });

  it('NO debería guardar si el email no es válido', () => {
    const notifSpy = vi.spyOn(notifService, 'advertencia');
    component.activarEdicion();
    component.actualizarCampo('email', 'correo-invalido');
    component.guardarCambios();
    expect(notifSpy).toHaveBeenCalledWith(
      'Por favor ingresa un correo electrónico válido.'
    );
  });

  it('debería formatear la fecha ISO correctamente', () => {
    const resultado = component.formatearFecha('2026-04-15T10:30:00');
    // Verifica que sea una cadena no vacía con formato legible
    expect(resultado).toBeTruthy();
    expect(resultado.length).toBeGreaterThan(5);
  });

  it('debería retornar la clase correcta para cada tipo de actividad', () => {
    expect(component.getIconoClase('aprobacion')).toContain('green');
    expect(component.getIconoClase('devolucion')).toContain('blue');
    expect(component.getIconoClase('rechazo')).toContain('red');
    expect(component.getIconoClase('incidencia')).toContain('yellow');
  });

  it('debería cargar el historial de actividades en ngOnInit', () => {
    expect(tecnicoService.getActividadReciente).toHaveBeenCalled();
    expect(component.actividad().length).toBe(2);
  });
});