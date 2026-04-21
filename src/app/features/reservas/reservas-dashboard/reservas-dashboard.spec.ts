/* 
Actualización de pruebas unitarias para ReservasDashboard, enfocándonos en la lógica de navegación, selección de slots y manejo del modal, 
sin depender de servicios externos ni autenticación real. Se simula el estado de autenticación mediante localStorage para validar la apertura 
del modal. Además, se verifica que los slots se calculen correctamente según la disponibilidad configurada.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReservasDashboard } from './reservas-dashboard';

describe('ReservasDashboard', () => {
  let component: ReservasDashboard;
  let fixture: ComponentFixture<ReservasDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasDashboard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener 11 slots de horario', () => {
    expect(component.horas.length).toBe(11);
  });

  it('debería tener 11 slots calculados en la vista diaria', () => {
    expect(component.horariosDelDia().length).toBe(11);
  });

  it('debería iniciar en vista semanal', () => {
    expect(component.vista()).toBe('semanal');
  });

  it('debería cambiar a vista diaria con cambiarVista()', () => {
    component.cambiarVista('diario');
    expect(component.vista()).toBe('diario');
  });

  it('debería avanzar una semana al llamar irSiguiente()', () => {
    const semanaAntes = component.semanaBase().getTime();
    component.irSiguiente();
    const semanaDespues = component.semanaBase().getTime();
    expect(semanaDespues - semanaAntes).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('debería retroceder una semana al llamar irAnterior()', () => {
    const semanaAntes = component.semanaBase().getTime();
    component.irAnterior();
    const semanaDespues = component.semanaBase().getTime();
    expect(semanaAntes - semanaDespues).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('debería iniciar con todos los slots disponibles', () => {
    const todasDisponibles = component
      .disponibilidad()
      .every((dia) => dia.every((slot) => slot === true));
    expect(todasDisponibles).toBe(true);
  });

  // Simula la selección de un slot semanal y verifica que el modal se abra solo si hay un token de sesión activo.
  it('NO debería abrir el modal si no hay token de sesión', () => {
    // Aseguramos que no haya token
    localStorage.removeItem('access_token');

    component.seleccionarSlotSemanal(0, 0);

    // El modal NO debe abrirse si no hay autenticación
    expect(component.mostrarModal()).toBe(false);
  });

  it('debería abrir el modal al seleccionar un slot con sesión activa', () => {
    // Simulamos un token activo
    localStorage.setItem('access_token', 'token-mock-valido');

    component.seleccionarSlotSemanal(0, 0);
    expect(component.mostrarModal()).toBe(true);

    // Limpieza
    localStorage.removeItem('access_token');
  });

  it('debería cerrar el modal con cerrarModal()', () => {
    localStorage.setItem('access_token', 'token-mock-valido'); // Simulamos un token activo
    component.seleccionarSlotSemanal(0, 0);
    expect(component.mostrarModal()).toBe(true);

    component.cerrarModal();
    expect(component.mostrarModal()).toBe(false);
    expect(component.slotActivo()).toBeNull();

    localStorage.removeItem('access_token'); // Limpieza del token simulado
  });

  it('NO debería abrir el modal si el slot está ocupado', () => {
    localStorage.setItem('access_token', 'token-mock-valido');

    component.disponibilidad.update((disp) => {
      const copia = disp.map((d) => [...d]);
      copia[0][0] = false;
      return copia;
    });

    component.seleccionarSlotSemanal(0, 0);
    expect(component.mostrarModal()).toBe(false);

    localStorage.removeItem('access_token');
  });
});