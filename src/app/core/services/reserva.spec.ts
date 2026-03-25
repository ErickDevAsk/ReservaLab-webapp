import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservaService } from './reserva';  

//import { Reserva } from './reserva';

describe('ReservaService', () => {
  let service: ReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ReservaService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});
