import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { inject } from '@angular/core';
import { combineLatest, map, of, tap } from 'rxjs';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];
  const namespace = 'https://transportes-gomez.cl/roles';

  return combineLatest([auth.isAuthenticated$, auth.idTokenClaims$]).pipe(
    tap(([isAuthenticated, claims]) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }

      const userRoles = claims?.[namespace] || [];

      const hasAccess = expectedRoles.length === 0 || expectedRoles.some(role => userRoles.includes(role));

      if (!hasAccess) {
        router.navigate(['/notfound']);
      }
    }),
    map(([isAuthenticated, claims]) => {
      const userRoles = claims?.[namespace] || [];
      return isAuthenticated && (expectedRoles.length === 0 || expectedRoles.some(role => userRoles.includes(role)));
    })
  );
};
