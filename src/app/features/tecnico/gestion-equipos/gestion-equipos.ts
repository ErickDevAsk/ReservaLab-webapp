import { Component } from '@angular/core';
import { EquiposService, Equipo } from '../services/equipos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-equipos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-equipos.html',
  styleUrl: './gestion-equipos.scss',
})
export class GestionEquipos {

  equipos: Equipo[] = [];

constructor(private equiposService: EquiposService) {}

ngOnInit() {
  this.cargarEquipos();
}

cargarEquipos() {
  this.equiposService.getEquipos().subscribe(data => {
    this.equipos = data;
  });
}

eliminar(id: number) {
  this.equiposService.eliminarEquipo(id).subscribe(() => {
    this.cargarEquipos();
  });
}

}

