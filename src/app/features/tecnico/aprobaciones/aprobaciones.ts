import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aprobaciones.html',
  styleUrl: './aprobaciones.scss',
})
export class Aprobaciones {

  solicitudes: any[] = [];
  devoluciones: any[] = [];
  vencidos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/loans/')
      .subscribe(data => {

        const hoy = new Date();

        // 🔵 Pendientes
        this.solicitudes = data.filter(d => d.estado === 'pendiente');

        // 🟡 Activos
        this.devoluciones = data.filter(d => d.estado === 'activo');

        // 🔴 Vencidos
        this.vencidos = data.filter(d =>
          new Date(d.fecha_devolucion) < hoy
        );

        console.log("Solicitudes:", this.solicitudes);
        console.log("Devoluciones:", this.devoluciones);
        console.log("Vencidos:", this.vencidos);
      });
  }
}