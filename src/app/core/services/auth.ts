import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private http = inject(HttpClient);
  private apiAccountsUrl = 'http://127.0.0.1:8000/api/accounts';
  //NUEVA URL base para Login (JWT)
  private apiTokenUrl = 'http://127.0.0.1:8000/api/token';

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiAccountsUrl}/register/`, userData);
  }
  // a veces suele ser /api/token/ en lugar de /api/accounts/login/)
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiTokenUrl}/`, credentials);
  }
}
