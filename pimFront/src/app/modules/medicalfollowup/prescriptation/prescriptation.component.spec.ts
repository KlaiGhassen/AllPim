import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptationComponent } from './prescriptation.component';

describe('PrescriptationComponent', () => {
  let component: PrescriptationComponent;
  let fixture: ComponentFixture<PrescriptationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
