import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard, AuthService } from '@auth0/auth0-angular';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

export const authGuard = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.isAuthenticated$.pipe(
        tap((isAuthenticated) => {
            if (!isAuthenticated) {
                router.navigate(['/auth/login']);
            }
        }),
        map(isAuthenticated => isAuthenticated)
    );
}