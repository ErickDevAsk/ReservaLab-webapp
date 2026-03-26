import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/labs/laboratorios/'; // URL base de Django para laboratorios

  obtenerLaboratorios() {
    return this.http.get<any[]>(this.API_URL);
  }
}
