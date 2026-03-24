import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'; // Importamos provideRouter para resolver la dependencia de Router en el componente
import { ReservasDashboard } from './reservas-dashboard';

describe('ReservasDashboard', () => {
  let component: ReservasDashboard;
  let fixture: ComponentFixture<ReservasDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasDashboard],
      // Proveemos un router vacío para evitar errores de inyección en el componente
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener 11 slots de horario', () => {
    // opción A — verifica el array de horas directamente
    expect(component.horas.length).toBe(11);
  });

  it('debería tener 11 slots calculados en la vista diaria', () => {
    // opción B — verifica el computed de la vista diaria
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
    const diff = semanaDespues - semanaAntes;
    // 7 días en milisegundos
    expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('debería retroceder una semana al llamar irAnterior()', () => {
    const semanaAntes = component.semanaBase().getTime();
    component.irAnterior();
    const semanaDespues = component.semanaBase().getTime();
    const diff = semanaAntes - semanaDespues;
    expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('debería iniciar con todos los slots disponibles', () => {
    // disponibilidad es 7 días x 11 horas, todas en true
    const disp = component.disponibilidad();
    const todasDisponibles = disp.every(dia => dia.every(slot => slot === true));
    expect(todasDisponibles).toBe(true);
  });

  it('debería mostrar el modal al seleccionar un slot disponible', () => {
    expect(component.mostrarModal()).toBe(false);
    component.seleccionarSlotSemanal(0, 0); // lunes, 08:00
    expect(component.mostrarModal()).toBe(true);
  });

  it('debería cerrar el modal con cerrarModal()', () => {
    component.seleccionarSlotSemanal(0, 0);
    expect(component.mostrarModal()).toBe(true);
    component.cerrarModal();
    expect(component.mostrarModal()).toBe(false);
    expect(component.slotActivo()).toBeNull();
  });

  it('NO debería abrir el modal si el slot está ocupado', () => {
    // Marcamos el primer slot como ocupado manualmente
    component.disponibilidad.update(disp => {
      const copia = disp.map(d => [...d]);
      copia[0][0] = false;
      return copia;
    });

    component.seleccionarSlotSemanal(0, 0);
    expect(component.mostrarModal()).toBe(false);
  });
});