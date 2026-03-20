import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';
// Importamos el componente del dashboard del estudiante
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
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
    canActivate: [authGuard]
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent
  },
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard
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
