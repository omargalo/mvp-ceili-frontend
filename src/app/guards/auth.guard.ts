import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  // Si no está autenticado, redirige a login
  return inject(Router).createUrlTree(['/login']);
};
