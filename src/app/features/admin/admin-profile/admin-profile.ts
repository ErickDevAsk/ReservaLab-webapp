import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.scss']
})
export class AdminProfileComponent {
  // Datos del Administrador
  admin = {
    nombre: 'Oscar Tomas',
    rol: 'Administrador Global',
    correo: 'oscar.tomas@alumno.buap.mx',
    departamento: 'Gestión de Laboratorios FCC'
  };

  // Estadísticas Globales del Sistema
  stats = {
    usuariosTotales: 142,
    tecnicosActivos: 8,
    laboratorios: 12,
    reservasHoy: 24
  };
}