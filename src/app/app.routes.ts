import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';

import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './features/student/student-profile/student-profile';

import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { GestionEquipos } from './features/tecnico/gestion-equipos/gestion-equipos';
import { Dashboard } from './features/tecnico/dashboard/dashboard';
import { GestionLabs } from './features/tecnico/gestion-labs/gestion-labs';
import { Aprobaciones } from './features/tecnico/aprobaciones/aprobaciones';
import { Reportes } from './features/tecnico/reportes/reportes';
import { Perfil } from './features/tecnico/perfil/perfil';

import { Reglamento } from './features/landing/reglamento/reglamento';
import { ReservasDashboard } from './features/reservas/reservas-dashboard/reservas-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'login-reserva',
    component: LoginComponent,
  },

  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Estudiante' }
  },

  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Estudiante' }
  },

  // 🔥 TECNICO (AQUÍ SE FUSIONÓ TODO)
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard,
    canActivate: [authGuard],
    data: { expectedRole: 'tecnico' },
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
    path: 'reglamento',
    component: Reglamento
  },

  {
    path: 'reservas',
    component: ReservasDashboard
  },

  {
    path: '**',
    redirectTo: ''
  }
];