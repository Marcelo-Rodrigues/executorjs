import { TestBed, inject } from '@angular/core/testing';

import { PersistenciaService } from './persistencia.service';

describe('PersistenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistenciaService]
    });
  });

  it('should be created', inject([PersistenciaService], (service: PersistenciaService) => {
    expect(service).toBeTruthy();
  }));
});
