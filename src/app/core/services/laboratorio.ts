import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

// NUEVO: Le creamos la interfaz que el código de tu compañero está buscando
export interface Laboratorio {
  id?: number;
  nombre: string;
  edificio: string;
  imagen?: string;
  facultad?: string;
  capacidad?: number;
  estado?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/labs/laboratorios/';

  // Tu método original intacto (para que tu modal siga funcionando)
  obtenerLaboratorios() {
    return this.http.get<any[]>(this.API_URL);
  }

  // NUEVO: El método que tu compañero inventó para que su componente no explote
  getLaboratorios() {
    return this.http.get<Laboratorio[]>(this.API_URL);
  }
  crearLaboratorio(lab: Laboratorio) {
    return this.http.post<Laboratorio>(this.API_URL, lab);
  }

  actualizarLaboratorio(id: number, lab: Laboratorio) {
    // IMPORTANTE: Nota la barra diagonal extra al final de la URL
    return this.http.put<Laboratorio>(`${this.API_URL}${id}/`, lab);
  }

  eliminarLaboratorio(id: number) {
    // IMPORTANTE: La barra diagonal al final es obligatoria en Django
    return this.http.delete(`${this.API_URL}${id}/`);
  }
}
