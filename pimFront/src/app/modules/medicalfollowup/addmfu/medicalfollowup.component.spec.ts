import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalfollowupComponent } from './medicalfollowup.component';

describe('MedicalfollowupComponent', () => {
  let component: MedicalfollowupComponent;
  let fixture: ComponentFixture<MedicalfollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalfollowupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalfollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
