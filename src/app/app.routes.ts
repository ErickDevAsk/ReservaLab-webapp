import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { FormularioReserva } from './features/reservas/formulario-reserva/formulario-reserva';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { GestionEquipos } from './features/tecnico/gestion-equipos/gestion-equipos';
import { Dashboard } from './features/tecnico/dashboard/dashboard';
import { GestionLabs } from './features/tecnico/gestion-labs/gestion-labs';
import { Aprobaciones } from './features/tecnico/aprobaciones/aprobaciones';
import { Reportes } from './features/tecnico/reportes/reportes';
import { Perfil } from './features/tecnico/perfil/perfil';
export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'login-reserva',
    component: FormularioReserva,
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent
  },

  // ✅ SOLO UNA RUTA PADRE
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'gestion-equipos',
        component: GestionEquipos
      },
      {
        path: 'gestion-labs',
        component: GestionLabs
      },
      {
        path: 'aprobaciones',
        component: Aprobaciones
      },
      {
        path: 'reportes',
        component: Reportes
      },
      {
        path: 'perfil',
        component: Perfil
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];