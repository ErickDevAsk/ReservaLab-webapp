import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';

// Importamos el Layout y las vistas del estudiante
import { StudentLayout } from './features/student/student-layout/student-layout';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './features/student/student-profile/student-profile';
import { ReservasDashboard } from './features/reservas/reservas-dashboard/reservas-dashboard';

import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { GestionEquipos } from './features/tecnico/gestion-equipos/gestion-equipos';
import { Dashboard } from './features/tecnico/dashboard/dashboard';
import { GestionLabs } from './features/tecnico/gestion-labs/gestion-labs';
import { Aprobaciones } from './features/tecnico/aprobaciones/aprobaciones';
import { Reportes } from './features/tecnico/reportes/reportes';
import { Perfil } from './features/tecnico/perfil/perfil';

import { Reglamento } from './features/landing/reglamento/reglamento';
export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'register', component: Register },
  { path: 'login-reserva', component: LoginComponent },
  { path: 'reglamento', component: Reglamento },

  // ==========================================
  // 🎓 ZONA DEL ESTUDIANTE (CON LAYOUT)
  // ==========================================
  {
    path: 'student',
    component: StudentLayout, // 1. Cargamos el cascarón con la barra lateral
    canActivate: [authGuard],          // 2. Protegemos TODA la zona del estudiante
    data: { expectedRole: 'Estudiante' },
    children: [                        // 3. Inyectamos los hijos en el <router-outlet>
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'reservas', component: ReservasDashboard },
      { path: 'perfil', component: StudentProfileComponent },
      // Si escriben "/student" a secas, los mandamos al dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'tecnico',
    component: TecnicoDashboard,
    canActivate: [authGuard],
    data: { expectedRole: 'tecnico' },
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'equipos', component: GestionEquipos },
      { path: 'labs', component: GestionLabs },
      { path: 'aprobaciones', component: Aprobaciones },
      { path: 'reportes', component: Reportes },
      { path: 'perfil', component: Perfil },

      // default
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 🛟 RUTAS DE RESCATE (REDIRECCIONES)
  // ==========================================
  // Si tu Login o código viejo apunta a las rutas anteriores, esto las corrige en automático
  { path: 'student-dashboard', redirectTo: 'student/dashboard', pathMatch: 'full' },
  { path: 'student-profile', redirectTo: 'student/perfil', pathMatch: 'full' },
  { path: 'reservas', redirectTo: 'student/reservas', pathMatch: 'full' },

  // Ruta comodín (Si escriben una ruta que no existe, van al inicio)
  { path: '**', redirectTo: '' }
];
