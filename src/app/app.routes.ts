import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
// Importamos el componente del dashboard del estudiante
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    // Ruta para el dashboard del estudiante
    path: 'student-dashboard',
    component: StudentDashboardComponent
  },
  {
    path: '**',
    redirectTo: ''
  } // Redirige cualquier ruta rota al inicio
];
