import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el gafete secreto en la memoria del navegador
  const token = localStorage.getItem('access_token');

  // 2. Si el usuario tiene un token, interceptamos la petición
  if (token) {
    // Clonamos la petición original para no romperla y le inyectamos la cabecera de seguridad
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Así es como Django espera recibirlo
      }
    });

    // Dejamos que la petición continúe su viaje hacia el backend de Erick, pero ya blindada
    return next(peticionClonada);
  }

  // 3. Si no hay token (por ejemplo, cuando apenas está intentando hacer Login o Registrarse), la dejamos pasar normal
  return next(req);
};
