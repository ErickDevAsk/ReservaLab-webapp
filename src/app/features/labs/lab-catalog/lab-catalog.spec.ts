import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCatalog } from './lab-catalog';

describe('LabCatalog', () => {
  let component: LabCatalog;
  let fixture: ComponentFixture<LabCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabCatalog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
