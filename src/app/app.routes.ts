import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { FormularioReserva } from './features/reservas/formulario-reserva/formulario-reserva';
// Importamos el componente del dashboard del estudiante
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
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
  {
    path: 'tecnico-dashboard',
    component: TecnicoDashboard
  },
  {
    path: '**',
    redirectTo: ''
  }
];
