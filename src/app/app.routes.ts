import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
<<<<<<< HEAD
import { FormularioReserva } from './features/reservas/formulario-reserva/formulario-reserva';
=======
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';
// Importamos el componente del dashboard del estudiante
>>>>>>> e69b4242fe6e5204f1daa5f1e4dd34907c347220
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './features/student/student-profile/student-profile';
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
<<<<<<< HEAD
import { GestionEquipos } from './features/tecnico/gestion-equipos/gestion-equipos';
import { Dashboard } from './features/tecnico/dashboard/dashboard';
import { GestionLabs } from './features/tecnico/gestion-labs/gestion-labs';
import { Aprobaciones } from './features/tecnico/aprobaciones/aprobaciones';
import { Reportes } from './features/tecnico/reportes/reportes';
import { Perfil } from './features/tecnico/perfil/perfil';
=======
import { Reglamento } from './features/landing/reglamento/reglamento';
import { ReservasDashboard } from './features/reservas/reservas-dashboard/reservas-dashboard';
>>>>>>> e69b4242fe6e5204f1daa5f1e4dd34907c347220
export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  { path: 'register',
    component: Register },
  {
    path: 'login-reserva',
    component: LoginComponent,
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard],
    // Le decimos al Guard que esta ruta es exclusiva para estudiantes
    data: { expectedRole: 'Estudiante' }
  },
  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [authGuard], // Le ponemos el candado también
    data: { expectedRole: 'Estudiante' } // Exclusivo para estudiantes
  },

  // ✅ SOLO UNA RUTA PADRE
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard,
<<<<<<< HEAD
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
=======
    canActivate: [authGuard],
    // Le decimos al Guard que esta ruta es exclusiva para tecnicos
    data: { expectedRole: 'tecnico' }
>>>>>>> e69b4242fe6e5204f1daa5f1e4dd34907c347220
  },

  {
    path: 'reglamento',
    component: Reglamento
  },
  {
    path: 'reservas',
    component: ReservasDashboard
  },
  // Ruta comodín (si escriben una URL a lo loco, los manda al inicio)
  {
    path: '**',
    redirectTo: ''
  }
];