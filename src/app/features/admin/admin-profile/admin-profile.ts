import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.scss']
})
export class AdminProfileComponent implements OnInit {
  private readonly perfilService = inject(AuthService);

  // Usamos un signal iniciando en null para saber cuando está cargando
  public admin = signal<any>(null);

  // Stats simuladas por ahora (puedes conectarlas a otro endpoint después)
  public stats = {
    usuariosTotales: 120,
    tecnicosActivos: 8,
    laboratorios: 5,
    reservasHoy: 34
  };

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilService.obtenerPerfil().subscribe({
      next: (data: any) => {
        // Guardamos los datos reales de Django en el signal
        this.admin.set(data);
      },
      error: (err: any) => {
        console.error('Error al cargar el perfil', err);
      }
    });
  }
}
