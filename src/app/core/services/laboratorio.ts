import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Laboratorio {
  id: number;
  nombre: string;
  edificio: string; 
  piso: number;
  capacidad: number;
  tipo: string;
  estado: string;
  facultad: string;
  imagen: string; 
}

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  
  // USA ESTA RUTA SIN EL /API/ Y SIN LAS BARRITAS //
  private apiUrl = 'http://127.0.0.1:8000/labs/laboratorios/';

  constructor(private http: HttpClient) { }

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }
}