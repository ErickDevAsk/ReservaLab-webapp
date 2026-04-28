import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './confirm-modal.html',
})
export class ConfirmModalComponent {

  @Input() titulo: string = '¿Estás seguro?';
  @Input() mensaje: string = 'Esta acción no se puede deshacer.';
  @Input() labelConfirmar: string = 'Eliminar';
  @Input() labelCancelar: string = 'Cancelar';
  @Input() tipo: 'danger' | 'warning' | 'info' = 'danger';
  @Input() cargando: boolean = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  get colorConfirmar(): string {
    switch (this.tipo) {
      case 'danger':  return 'bg-red-600 hover:bg-red-700 shadow-red-200';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200';
      case 'info':    return 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';
    }
  }

  get icono(): string {
    switch (this.tipo) {
      case 'danger':  return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info':    return 'text-blue-600 bg-blue-50';
    }
  }
}
