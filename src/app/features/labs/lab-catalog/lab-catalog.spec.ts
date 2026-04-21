import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCatalogComponent } from './lab-catalog';

describe('LabCatalogComponent', () => {
  let component: LabCatalogComponent;
  let fixture: ComponentFixture<LabCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabCatalogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
