import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Definimos cómo se ve un Laboratorio que viene de Django
export interface Laboratorio {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  facultad: string; // Ej. 'FCC' o 'FIQ'
  imagen: string;   // URL de la foto
}

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  
  // 2. La dirección exacta de tu backend de Django
  private apiUrl = 'http://127.0.0.1:8000/api/laboratorios/'; 

  // 3. Le damos su "moto" (HttpClient) para viajar a internet
  constructor(private http: HttpClient) { }

  // 4. El método que llamaremos para pedir la lista
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }
}