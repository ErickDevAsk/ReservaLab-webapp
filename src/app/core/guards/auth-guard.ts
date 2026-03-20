import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Revisamos si existe el "gafete" (token) en el almacenamiento del navegador
  const token = localStorage.getItem('access_token'); // Ajusta esto si tu variable se llama distinto

  if (token) {
    // Si hay token, lo dejamos pasar al dashboard
    return true;
  }

  // Si no hay token, lo pateamos a la pantalla de login
  router.navigate(['/login-reserva']);
  return false;
};
