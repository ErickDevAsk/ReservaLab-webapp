/*
Refactorización completa del componente de reserva-modal.spec.ts para agregar pruebas unitarias que validen la lógica de selección de equipos, 
validaciones de formulario y emisión de eventos. Se utilizan spies para verificar interacciones con el servicio de notificaciones y se simulan 
escenarios de usuario para asegurar un comportamiento robusto del componente.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReservaModal } from './reserva-modal';
import { NotificationService } from '../../../../core/services/notification';

describe('ReservaModal', () => {
  let component: ReservaModal;
  let fixture: ComponentFixture<ReservaModal>;
  let notifService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaModal, FormsModule], // Aseguramos importar FormsModule para las pruebas
    }).compileComponents(); // Compilamos el componente

    fixture = TestBed.createComponent(ReservaModal);
    component = fixture.componentInstance;
    notifService = TestBed.inject(NotificationService);

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

  // Prueba de validación: no permitir confirmar sin laboratorio seleccionado
  it('NO debería confirmar si no hay laboratorio seleccionado', () => {
    const spy      = vi.spyOn(component.alConfirmar, 'emit');
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.laboratorio = ''; // Sin seleccionar laboratorio
    component.proposito   = 'Práctica de redes para la materia de Redes II';

    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'Por favor, selecciona un laboratorio.'
    );
  });

  // Prueba de validación: no permitir confirmar sin propósito
  it('NO debería confirmar si no hay equipos seleccionados', () => {
    const spy      = vi.spyOn(component.alConfirmar, 'emit');
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.laboratorio = 'Laboratorio de Física';
    component.proposito   = 'Práctica de redes para la materia de Redes II';
    // Sin seleccionar ningún equipo
    component.confirmarReserva();
    // Esperamos que no se emita el evento de confirmación y que se muestre la advertencia correspondiente
    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'Selecciona al menos un equipo para tu reserva.'
    );
  });

  // Prueba de validación: no permitir confirmar con propósito muy corto
  it('NO debería confirmar si el propósito tiene menos de 10 caracteres', () => {
    const spy      = vi.spyOn(component.alConfirmar, 'emit');
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    component.laboratorio = 'Laboratorio de Física';
    component.proposito   = 'Corto';

    // Simulamos un equipo seleccionado directamente
    component.equiposDisponibles = [{
      id: 1, nombre: 'Microscopio Óptico',
      numero_inventario: 'MIC-001',
      cantidad_total: 10, cantidad_disponible: 8,
      estado: 'Disponible', laboratorio: 1,
      seleccionado: true, cantidadRequerida: 1
    }];

    component.confirmarReserva();

    expect(spy).not.toHaveBeenCalled();
    expect(notifSpy).toHaveBeenCalledWith(
      'El propósito debe tener al menos 10 caracteres.' // Validación de longitud mínima del propósito
    );
  });

  // Prueba de confirmación exitosa con datos válidos
  it('debería confirmar correctamente con todos los datos válidos', () => {
    const spy = vi.spyOn(component.alConfirmar, 'emit');

    component.laboratorio = 'Laboratorio de Física';
    component.proposito   = 'Práctica de redes para la materia de Redes II';
    component.duracion    = 2;

    // Simulamos un equipo seleccionado
    component.equiposDisponibles = [{
      id: 1, nombre: 'Microscopio Óptico',
      numero_inventario: 'MIC-001',
      cantidad_total: 10, cantidad_disponible: 8,
      estado: 'Disponible', laboratorio: 1,
      seleccionado: true, cantidadRequerida: 2
    }];

    component.confirmarReserva(); 

    // Esperamos que se emita el evento de confirmación con el payload correcto
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      laboratorio: 'Laboratorio de Física',
      duracion:    2,
      proposito:   'Práctica de redes para la materia de Redes II',
      equipos:     [{ id: 1, nombre: 'Microscopio Óptico', cantidadRequerida: 2 }]
    }));
  });

  // Prueba de selección de equipo sin stock disponible
  it('NO debería seleccionar un equipo sin stock disponible', () => {
    const notifSpy = vi.spyOn(notifService, 'advertencia');

    const equipoSinStock = {
      id: 5, nombre: 'Espectrofotómetro UV',
      numero_inventario: 'ESP-001',
      cantidad_total: 3, cantidad_disponible: 0,
      estado: 'Mantenimiento', laboratorio: 1,
      seleccionado: false, cantidadRequerida: 1
    };

    component.toggleEquipo(equipoSinStock);

    expect(equipoSinStock.seleccionado).toBe(false);
    expect(notifSpy).toHaveBeenCalledWith(
      '"Espectrofotómetro UV" no tiene unidades disponibles actualmente.'
    );
  });
});