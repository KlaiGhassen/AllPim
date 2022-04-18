import { TestBed } from '@angular/core/testing';

import { MedicalfollowupService } from './medicalfollowupService.service';

describe('MedicalfollowupServiceService', () => {
  let service: MedicalfollowupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalfollowupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
