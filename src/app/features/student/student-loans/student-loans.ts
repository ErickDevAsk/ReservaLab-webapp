import { Equipo, EquipoPayload } from './../../../core/services/equipo';
import { EquipoService } from './../../../core/services/equipo';
import { Component, OnInit, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [NgClass],
  templateUrl: './student-loans.html'
})
export class StudentLoansComponent implements OnInit {
  private equipoService = inject(EquipoService);

  // Estados reactivos con Signals
  activeTab = signal<'catalogo' | 'mis-prestamos'>('catalogo');
  equipos = signal<Equipo[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.cargarCatologo();
  }

  cargarCatologo() {
    this.isLoading.set(true);
    this.error.set(null);

    this.equipoService.getEquipos().subscribe({
      next: (data) => {
        this.equipos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar ReservaLab:', err);
        this.error.set('No se pudo cargar el catálogo. Verifica tu conexión o permisos.');
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'catalogo' | 'mis-prestamos') {
    this.activeTab.set(tab);
  }

  solicitarEquipo(equipo: Equipo) {
    if (equipo.cantidad_disponible > 0) {
      console.log(`Solicitando: ${equipo.nombre} (Inv: ${equipo.numero_inventario})`);
      // Aquí puedes abrir tu modal de confirmación o llamar al endpoint de préstamos
    }
  }
}
