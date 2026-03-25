import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';
// Importamos el componente del dashboard del estudiante
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './features/student/student-profile/student-profile';
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { Reglamento } from './features/landing/reglamento/reglamento';
import { ReservasDashboard } from './features/reservas/reservas-dashboard/reservas-dashboard';
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
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard,
    canActivate: [authGuard],
    // Le decimos al Guard que esta ruta es exclusiva para tecnicos
    data: { expectedRole: 'tecnico' }
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
