import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  onLogin() {
    console.log('Enviando a Django:', this.loginData);
    const url = 'http://127.0.0.1:8000/api/token/';

    this.http.post(url, this.loginData).subscribe({
      next: (res: any) => {
        alert('¡CONEXIÓN EXITOSA!');
        console.log('Token:', res);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error: Usuario no encontrado o servidor apagado.');
      }
    });
  }
}