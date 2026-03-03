import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReserva } from './formulario-reserva';

describe('FormularioReserva', () => {
  let component: FormularioReserva;
  let fixture: ComponentFixture<FormularioReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioReserva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
