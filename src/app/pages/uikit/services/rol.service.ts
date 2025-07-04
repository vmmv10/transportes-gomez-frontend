import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private readonly namespace = 'https://transportes-gomez.cl/roles';
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();

  constructor(private auth: AuthService) {
    this.auth.idTokenClaims$.subscribe(claims => {
      const roles = claims?.[this.namespace] || [];
      this.rolesSubject.next(roles);
    });
  }

  tieneRol(rol: string) {
    return this.roles$.pipe(map(roles => roles.includes(rol)));
  }

  tieneAlgunRol(rolesPermitidos: string[]) {
    return this.roles$.pipe(
      map(roles => rolesPermitidos.some(r => roles.includes(r)))
    );
  }

  getRolesActuales(): string[] {
    return this.rolesSubject.getValue();
  }
}
