import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditModal } from './profile-edit-modal';

describe('ProfileEditModal', () => {
  let component: ProfileEditModal;
  let fixture: ComponentFixture<ProfileEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
