import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { PermisoRolService } from '../../features/maintenance/services/permiso-rol.service';

/**
 * Guard que verifica si el rol del usuario autenticado tiene permiso
 * de acceso a la vista que está intentando navegar.
 *
 * La URI que se envía al backend es la ruta Angular sin la barra inicial,
 * p.ej. "security/users", "maintenance/sedes", "conocimiento", etc.
 *
 * Si el backend devuelve { autorizado: false } o hay un error, el usuario
 * es redirigido a /acceso-denegado.
 */
export const permisosGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const svc    = inject(PermisoRolService);
  const router = inject(Router);

  // Eliminamos la barra inicial para obtener la URI relativa
  const uri = state.url.replace(/^\//, '').split('?')[0];

  return svc.verificarAcceso(uri).pipe(
    map(autorizado => {
      if (autorizado) return true;
      return router.createUrlTree(['/acceso-denegado']);
    }),
    catchError(() => of(router.createUrlTree(['/acceso-denegado'])))
  );
};
