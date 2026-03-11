import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { Register } from './features/auth/register/register';
import { FormularioReserva } from './features/reservas/formulario-reserva/formulario-reserva';
// Importamos el componente del dashboard del estudiante
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { Reglamento } from './features/landing/reglamento/reglamento';
export const routes: Routes = [
  {
    path: '',
    component: LandingPage,

  },
  { path: 'register',
    component: Register },
  {
    path: 'login-reserva',
    component: FormularioReserva,
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
    path: '**',
    redirectTo: ''
  }
];
