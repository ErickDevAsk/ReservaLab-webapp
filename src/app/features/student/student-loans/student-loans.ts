import { Equipo, EquipoPayload } from './../../../core/services/equipo';
import { EquipoService } from './../../../core/services/equipo';
import { NotificationService } from '../../../core/services/notification'; // Importamos tus notificaciones
import { Component, OnInit, signal, inject } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './student-loans.html',
  styleUrl: './student-loans.scss'
})
export class StudentLoansComponent implements OnInit {
  private equipoService = inject(EquipoService);
  private notifService  = inject(NotificationService); // Inyectamos el servicio de notificaciones

  misPrestamos = signal<any[]>([]);
  activeTab = signal<'catalogo' | 'mis-prestamos'>('catalogo');
  equipos = signal<Equipo[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  showModal = signal(false);
  selectedEquipo = signal<Equipo | null>(null);
  minDate = new Date().toISOString().split('T')[0]; // Evita fechas pasadas

  loanForm = {
  cantidad: 1,
  fecha_devolucion: ''
  };

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
        console.error('Error al cargar catálogo:', err);
        this.error.set('No se pudo cargar el catálogo. Verifica tu conexión.');
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'catalogo' | 'mis-prestamos') {
    this.activeTab.set(tab);

    // Si entra a Mis Préstamos, disparamos la petición a la base de datos
    if (tab === 'mis-prestamos') {
      this.cargarMisPrestamos();
    }
  }

  solicitarEquipo(equipo: Equipo) {
    this.selectedEquipo.set(equipo);
    this.loanForm.cantidad = 1;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedEquipo.set(null);
  }

  confirmarSolicitud() {
    const equipo = this.selectedEquipo();
    if (!equipo || !this.loanForm.fecha_devolucion) {
      this.notifService.error('Por favor completa todos los campos.');
      return;
    }

    // Ya no mandamos el campo 'usuario', Django lo pondrá por nosotros
    const payload = {
      equipo: equipo.id,
      cantidad_solicitada: this.loanForm.cantidad,
      fecha_devolucion_prevista: this.loanForm.fecha_devolucion // Asegúrate que sea un string YYYY-MM-DD
    };

    this.equipoService.solicitarPrestamo(payload).subscribe({
      next: () => {
        this.notifService.exito(`¡Solicitud de ${equipo.nombre} enviada!`);
        this.closeModal();
        this.cargarCatologo();
      },
      error: (err) => {
        console.error(err);
        this.notifService.error('Error al procesar la solicitud.');
      }
    });
  }

  // Función que pide los datos a Django
  cargarMisPrestamos() {
    this.equipoService.getMisPrestamos().subscribe({
      next: (data) => {
        // 💡 TIP: Si Django te está devolviendo TODOS los préstamos revueltos (de todos los alumnos),
        // puedes filtrarlos aquí temporalmente mientras lo arreglan en el backend:
        // const miUsuarioId = ... (sacarlo del token)
        // this.misPrestamos.set(data.filter(p => p.usuario === miUsuarioId));

        // Si el backend ya los filtra bien, solo hacemos esto:
        this.misPrestamos.set(data);
      },
      error: (err) => console.error('Error al cargar historial', err)
    });
  }
}
