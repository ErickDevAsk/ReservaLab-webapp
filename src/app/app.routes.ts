import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing-page/landing-page';
import { FormularioReserva } from './features/reservas/formulario-reserva/formulario-reserva';

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
    path: '**',
    redirectTo: ''
  }
];
