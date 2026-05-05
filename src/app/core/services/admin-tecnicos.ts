import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminTecnicosService {
  private readonly http = inject(HttpClient);

  // Asegúrate de que esta URL coincida con tu ruta en urls.py de Django
  private readonly API_URL = 'http://localhost:8000/api/accounts/tecnicos/';

  // Obtener la lista de técnicos desde el ViewSet de Django
  obtenerStaff(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Enviar el nuevo técnico a la base de datos
  registrarNuevoTecnico(datos: any): Observable<any> {
    return this.http.post(this.API_URL, datos);
  }

  // Función para dar de baja (opcional pero útil)
  eliminarTecnico(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}${id}/`);
  }
  actualizarTecnico(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.API_URL}${id}/`, datos);
  }
}
