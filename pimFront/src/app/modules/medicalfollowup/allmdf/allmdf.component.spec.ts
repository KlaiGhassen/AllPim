import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllmdfComponent } from './allmdf.component';

describe('AllmdfComponent', () => {
  let component: AllmdfComponent;
  let fixture: ComponentFixture<AllmdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllmdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllmdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
