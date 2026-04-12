import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLabs } from './gestion-labs';

describe('GestionLabs', () => {
  let component: GestionLabs;
  let fixture: ComponentFixture<GestionLabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
