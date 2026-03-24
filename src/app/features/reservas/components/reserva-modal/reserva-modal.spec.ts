import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReservaModal } from './reserva-modal';
import { NotificationService } from '../../../../core/services/notification';

describe('ReservaModal', () => {
  let component: ReservaModal;
  let fixture: ComponentFixture<ReservaModal>;
  // Referencia al servicio para espiar sus métodos
  let notifService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaModal, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaModal);
    component = fixture.componentInstance;

    // Obtenemos la instancia del servicio desde el injector
    notifService = TestBed.inject(NotificationService);

    // Configuramos los inputs requeridos para que el componente se inicialice correctamente
    fixture.componentRef.setInput('hora', '08:00');
    fixture.componentRef.setInput('fechaDisplay', 'lunes, 16 de marzo de 2026');

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir "alCerrar" cuando se cancela', () => {
    const spy = vi.spyOn(component.alCerrar, 'emit');
    component.cerrar();
    expect(spy).toHaveBeenCalled();
  });

  it('NO debería confirmar si el propósito es muy corto (menos de 10 caracteres)', () => {
    const spy = vi.spyOn(component.alConfirmar, 'emit');

    // FIX: propiedades normales en lugar de Signals
    component.proposito    = 'Corto'; // Solo 5 letras
    component.laboratorio  = 'Laboratorio de Física';
    component.equipo       = 'Microscopio Óptico';

    // Espiamos el método de notificación para verificar que se muestre el mensaje de error
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'El propósito debe tener al menos 10 caracteres.'
    );
  });

  it('debería confirmar con éxito si los datos son válidos', () => {
    const spy = vi.spyOn(component.alConfirmar, 'emit');

    // FIX: propiedades normales en lugar de Signals
    component.proposito   = 'Práctica de redes para la materia de Redes II';
    component.equipo      = 'Router Cisco';
    component.laboratorio = 'Laboratorio de Física';
    component.duracion    = 2;

    component.confirmarReserva();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      duracion:  2,
      proposito: 'Práctica de redes para la materia de Redes II'
    }));
  });

  it('NO debería confirmar si no se seleccionó laboratorio', () => {
    const spy     = vi.spyOn(component.alConfirmar, 'emit');
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.laboratorio = ''; // Sin seleccionar
    component.equipo      = 'Microscopio Óptico';
    component.proposito   = 'Práctica de redes para la materia de Redes II';

    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'Por favor, selecciona un laboratorio.'
    );
  });

  it('NO debería confirmar si no se seleccionó equipo', () => {
    const spy      = vi.spyOn(component.alConfirmar, 'emit');
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.laboratorio = 'Laboratorio de Física';
    component.equipo      = ''; // Sin seleccionar
    component.proposito   = 'Práctica de redes para la materia de Redes II';

    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'Por favor, selecciona el equipo necesario.'
    );
  });
});