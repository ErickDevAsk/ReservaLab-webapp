import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservasDashboard } from './reservas-dashboard';

describe('ReservasDashboard', () => {
  let component: ReservasDashboard;
  let fixture: ComponentFixture<ReservasDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener 11 slots de horario iniciales', () => {
    expect(component.horarioSlots().length).toBe(11);
  });
});
