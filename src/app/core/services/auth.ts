import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; //Agregamos el router para redirigir al salir
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router); // Inyectamos el router

  private apiAccountsUrl = `${environment.apiUrl}accounts`; // Asegúrate de que esta URL coincida con tu urls.py de Django
  private apiTokenUrl = `${environment.apiUrl}token`; // URL para obtener el token JWT

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiAccountsUrl}/register/`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiTokenUrl}/`, credentials);
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get(`${this.apiAccountsUrl}/perfil/`);
  }

  actualizarPerfil(datosNuevos: any): Observable<any> {
    return this.http.patch(`${this.apiAccountsUrl}/perfil/`, datosNuevos);
  }

  // ==========================================
  // 🔥 NUEVAS FUNCIONES PARA EL MANEJO DE SESIÓN
  // ==========================================

  // Llama a esta función desde tu componente de Login cuando la petición sea exitosa
  guardarSesion(token: string, rol: string) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', rol.toLowerCase()); // Lo pasamos a minúsculas por si acaso
  }

  // Esta es la que usará tu Sidebar
  getUserRole(): string {
    // Si no hay rol guardado, asumimos 'estudiante' por seguridad
    return localStorage.getItem('user_role') || 'estudiante';
  }

  // Limpia los datos y expulsa al usuario
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']); // Lo mandamos a la pantalla de inicio
  }
}
