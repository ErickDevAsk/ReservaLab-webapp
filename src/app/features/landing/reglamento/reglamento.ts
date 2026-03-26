import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Norma {
  numero: number;
  titulo: string;
  icono: string;
  puntos: string[];
}

@Component({
  selector: 'app-reglamento',
  imports: [CommonModule],
  templateUrl: './reglamento.html',
  styleUrl: './reglamento.scss',
})
export class Reglamento {
  // Signal con la información exacta de las capturas
  normas = signal<Norma[]>([
    {
      numero: 1,
      titulo: 'Normas Generales de Uso',
      icono: 'file-text',
      puntos: [
        'El uso de los laboratorios es exclusivo para fines académicos y de investigación.',
        'Es obligatorio portar el carné universitario vigente para ingresar.',
        'Queda prohibido el consumo de alimentos y bebidas dentro de las instalaciones.',
        'El silencio y el respeto hacia los demás usuarios son fundamentales.'
      ]
    },
    {
      numero: 2,
      titulo: 'Seguridad y Protección',
      icono: 'shield-check',
      puntos: [
        'Es obligatorio el uso de bata blanca de laboratorio en áreas experimentales.',
        'Se deben utilizar gafas de seguridad y guantes cuando el protocolo lo indique.',
        'Localice las salidas de emergencia y los extintores al ingresar.',
        'No se permite correr ni realizar juegos dentro del laboratorio.'
      ]
    },
    {
      numero: 3,
      titulo: 'Manejo de Equipos',
      icono: 'flask',
      puntos: [
        'No manipule equipos sin previa autorización o capacitación.',
        'Cualquier falla en los equipos debe ser reportada inmediatamente al técnico.',
        'El usuario es responsable del equipo solicitado durante el tiempo de préstamo.',
        'La limpieza y orden de los equipos es responsabilidad del usuario.'
      ]
    },
    {
      numero: 4,
      titulo: 'Reservas y Tiempos',
      icono: 'clook',
      puntos: [
        'Las reservas deben realizarse con al menos 24 horas de anticipación.',
        'Existe una tolerancia de 15 minutos; de lo contrario, la reserva se cancelará.',
        'Las renovaciones de préstamos están sujetas a disponibilidad.',
        'El incumplimiento de los horarios afectará la calificación de usuario.'
      ]
    }
  ]);
}
