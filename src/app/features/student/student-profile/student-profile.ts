import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss' // 👇 AQUÍ ESTÁ LA CONEXIÓN VITAL AL SCSS
})
export class StudentProfileComponent implements OnInit {
  isMobileMenuOpen = signal(false);

  // Datos de prueba para tu maqueta (usando tu info real)
  perfilData = signal({
    nombre: 'Christian',
    matricula: '202145678',
    universidad: 'Benemérita Universidad Autónoma de Puebla (BUAP)',
    carrera: 'Ingeniería en Tecnologías de la Información',
    correo: 'christian.m@alum.buap.mx',
    telefono: '+52 222 123 4567',
    equipoRegistrado: 'ASUS Vivobook Go 15 (AMD Ryzen 5)',
    habilidades: ['Linux', 'Python', 'SQL', 'C++', 'Redes']
  });

  ngOnInit() {
    // Espacio reservado para el futuro this.http.get() a Django
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  }
}
