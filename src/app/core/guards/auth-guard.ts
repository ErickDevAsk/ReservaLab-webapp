import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1. Buscamos el gafete
  const token = localStorage.getItem('access_token');

  if (token) {
    try {
      // 2. Desencriptamos el gafete para ver quién es
      const decodedToken: any = jwtDecode(token);
      const userRole = decodedToken.rol; // Leemos el rol que viene de Django

      // 3. Revisamos qué rol exige la ruta a la que quiere entrar
      const expectedRole = route.data['expectedRole'];

      // 4. Si la ruta exige un rol específico y el usuario NO lo tiene...
      if (expectedRole && expectedRole !== userRole) {
        console.warn('Acceso denegado: Rol incorrecto');

        // Lo pateamos a su dashboard correspondiente según su verdadero rol
        if (userRole === 'Estudiante') {
          router.navigate(['/student-dashboard']);
        } else if (userRole === 'tecnico') {
          router.navigate(['/tecnico-dashboard']);
        } else if (userRole === 'Administrador') {
          router.navigate(['/admin-dashboard']);
        } else {
          router.navigate(['/']); // Fallback por si acaso
        }
        return false;
      }

      // 5. Si tiene token y su rol coincide con el exigido, ¡pásale!
      return true;

    } catch (error) {
      // Si el token está corrupto o alterado, lo borramos y lo mandamos al login
      console.error('Token inválido', error);
      localStorage.removeItem('access_token');
      router.navigate(['/login-reserva']);
      return false;
    }
  }

  // Si de plano no hay token, a la pantalla de login
  router.navigate(['/login-reserva']);
  return false;
};
