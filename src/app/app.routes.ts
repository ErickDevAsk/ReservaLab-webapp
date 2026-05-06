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

// Importamos tu Centro de Mando (Sin el .ts)
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile';
import { GestionUsuariosComponent } from './features/admin/gestion-usuarios/gestion-usuarios';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
// Importamos el Layout y las vistas del técnico
import { TecnicoDashboard } from './features/tecnico/tecnico-dashboard/tecnico-dashboard';
import { Dashboard } from './features/tecnico/dashboard/dashboard';
import { Aprobaciones } from './features/tecnico/aprobaciones/aprobaciones';
import { Reportes } from './features/tecnico/reportes/reportes';
import { Perfil } from './features/tecnico/perfil/perfil';

import { Reglamento } from './features/landing/reglamento/reglamento';
import { AdminGestionEquipos } from './features/admin/admin-gestion-equipos/admin-gestion-equipos';
import { GestionLabsComponent } from './features/admin/gestion-labs/gestion-labs';
import { StudentLoansComponent } from './features/student/student-loans/student-loans';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';

export const routes: Routes = [
  // 🌍 RUTAS PÚBLICAS
  { path: '', component: LandingPage },
  { path: 'login-reserva', component: LoginComponent },
  { path: 'registro-estudiante', component: Register },
  { path: 'reglamento', component: Reglamento },

// ==========================================
  // 👑 ZONA DEL ADMINISTRADOR (Tú)
  // ==========================================
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    data: { expectedRole: 'Administrador' },
    children: [
      { path: 'perfil', component: AdminProfileComponent },
      { path: 'gestion-usuarios', component: GestionUsuariosComponent },
      { path: 'gestion-equipos', component: AdminGestionEquipos },
      { path: 'gestion-labs', component: GestionLabsComponent },
      { path: 'aprobaciones', component: Aprobaciones },
      { path: 'dashboard', component: AdminDashboard },
      // Redirige por defecto al perfil si solo ponen /admin
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }
    ]
  },
  // ==========================================
  // 🎓 ZONA DEL ESTUDIANTE (CON LAYOUT)
  {
    path: 'student',
    component: StudentLayout,
    canActivate: [authGuard],
    data: { expectedRole: 'Estudiante' },
    children: [
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'reservas', component: ReservasDashboard },
      { path: 'equipos', component: StudentLoansComponent },
      { path: 'perfil', component: StudentProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 🛠️ ZONA DEL TÉCNICO
  // ==========================================

  // 🔧 ZONA DEL TÉCNICO (CON LAYOUT)
  {
    path: 'tecnico',

    component: TecnicoDashboard, // Actúa como el cascarón (Sidebar + Navbar)

    canActivate: [authGuard],
    data: { expectedRole: 'Tecnico' },
    children: [
      { path: 'dashboard', component: Dashboard },

      { path: 'perfil', component: Perfil }, // <-- ¡Aquí está tu componente!
      { path: 'aprobaciones', component: Aprobaciones },
      { path: 'reportes', component: Reportes },
      { path: 'aprobaciones', component: Aprobaciones },
      { path: 'reportes', component: Reportes },
      { path: 'perfil', component: Perfil },

      // default

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 🛟 RUTAS DE RESCATE (REDIRECCIONES)
  { path: 'student-dashboard',  redirectTo: 'student/dashboard',  pathMatch: 'full' },
  { path: 'student-profile',    redirectTo: 'student/perfil',     pathMatch: 'full' },

  // FIX: Agregamos redirecciones para TODAS las rutas antiguas del técnico
  { path: 'tecnico-dashboard',                 redirectTo: 'tecnico/dashboard',       pathMatch: 'full' },
  { path: 'tecnico-dashboard/dashboard',       redirectTo: 'tecnico/dashboard',       pathMatch: 'full' },
  { path: 'tecnico-dashboard/perfil',          redirectTo: 'tecnico/perfil',          pathMatch: 'full' },
  { path: 'tecnico-dashboard/gestion-equipos', redirectTo: 'tecnico/gestion-equipos', pathMatch: 'full' },
  { path: 'tecnico-dashboard/gestion-labs',    redirectTo: 'tecnico/gestion-labs',    pathMatch: 'full' },
  { path: 'tecnico-dashboard/aprobaciones',    redirectTo: 'tecnico/aprobaciones',    pathMatch: 'full' },
  { path: 'tecnico-dashboard/reportes',        redirectTo: 'tecnico/reportes',        pathMatch: 'full' },

  // Redirección por defecto a la landing si la ruta no existe
  { path: '**', redirectTo: '' }
];
