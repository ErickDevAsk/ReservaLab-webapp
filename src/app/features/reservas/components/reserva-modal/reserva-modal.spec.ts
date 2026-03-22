import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReservaModal } from './reserva-modal';

describe('ReservaModal', () => {
  let component: ReservaModal;
  let fixture: ComponentFixture<ReservaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //importamos FormsModule para que el componente funcione correctamente en el test
      imports: [ReservaModal, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaModal);
    component = fixture.componentInstance;
    await fixture.whenStable();

    //seteamos inputs para evitar errores de bindings
    fixture.componentRef.setInput('horaInicio', '08:00 - 10:00');

    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir "alCerrar" cuando se cancela', () => {
    const spy = spyOn(component.alCerrar, 'emit');
    component.cerrar();
    expect(spy).toHaveBeenCalled();
  });

  it('NO debería confirmar si el propósito es muy corto (menos de 10 caracteres)', () => {
    const spy = spyOn(component.alConfirmar, 'emit');
    // Espiamos el alert para que no bloquee el test
    spyOn(window, 'alert'); 

    component.proposito.set('Corto'); // Solo 5 letras
    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Por favor, describe el propósito con al menos 10 caracteres.');
  });

  it('debería confirmar con éxito si los datos son válidos', () => {
    const spy = spyOn(component.alConfirmar, 'emit');
    
    component.proposito.set('Práctica de redes para la materia de Redes II');
    component.equipo.set('Router Cisco');
    component.duracion.set(2);
    
    component.confirmarReserva();

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
      duracion: 2,
      proposito: 'Práctica de redes para la materia de Redes II'
    }));
  });
});
