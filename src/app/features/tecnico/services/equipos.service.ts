import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipo {
  id?: number;
  nombre: string;
  descripcion: string;
  numero_inventario: string;
  cantidad_total: number;
  cantidad_disponible: number;
  estado: string;
  laboratorio?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  private apiUrl = 'http://127.0.0.1:8000/api/equipos/';

  constructor(private http: HttpClient) {}

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  crearEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.apiUrl, equipo);
  }

  eliminarEquipo(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}