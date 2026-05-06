import { Component, OnInit } from '@angular/core';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit{

  posicionLeyenda = LegendPosition.Right;
  // -- Configuración de Colores --
  // Puedes usar colores HEX o nombres de la paleta predefinida
  colorSchemeLinea: any = {
    domain: ['#10B981'] // Verde esmeralda (como en tu foto)
  };

  colorSchemePastel: any = {
    domain: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981'] // Azul, Amarillo, Rojo, Verde
  };

  // -- Datos para las Gráficas --
  datosTendencia: any[] = [];
  datosEstado: any[] = [];

  constructor(/* inyecta tu servicio aquí */) {}

  ngOnInit() {
    // Aquí llamas a tus funciones para cargar contadores y datos de usuario...
    this.cargarDatosGraficas();
  }

  cargarDatosGraficas() {
    // Simularemos la respuesta del backend por ahora.
    // Cuando lo conectes a Django, aquí iría tu suscripción al servicio.
    // Ejemplo: this.dashboardService.getGraficas().subscribe(data => { ... });

    // Datos para la Gráfica de Línea (Tendencia)
    this.datosTendencia = [
      {
        name: 'Reservas',
        series: [
          { name: 'Lun', value: 45 },
          { name: 'Mar', value: 52 },
          { name: 'Mié', value: 48 },
          { name: 'Jue', value: 61 },
          { name: 'Vie', value: 38 }
        ]
      }
    ];

    // Datos para la Gráfica de Pastel (Distribución de Estados [cite: 158])
    this.datosEstado = [
      { name: 'Confirmadas', value: 87 },
      { name: 'Pendientes', value: 24 },
      { name: 'Canceladas', value: 5 },
      { name: 'Devueltas', value: 120 }
    ];
  }
}
