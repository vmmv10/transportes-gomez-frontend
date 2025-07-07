import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@auth0/auth0-angular';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ButtonModule],
    templateUrl: './app.menu.html'
})
export class AppMenu {
    public authService = inject(AuthService);
    model: MenuItem[] = [];
    roles: string[] = [];
    private namespace = 'https://transportes-gomez.cl/roles';

    ngOnInit(): void {
        this.authService.idTokenClaims$.subscribe((claims) => {
            this.roles = claims?.[this.namespace] || [];
            this.buildMenu();
        });
    }

    private buildMenu() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Modulos',
                items: [
                    { label: 'Escuelas', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/escuelas'] },
                    { label: 'Ordenes de Servicios', icon: 'pi pi-fw pi-file', routerLink: ['/ordenes-servicios'] },
                    { label: 'Documentos', icon: 'pi pi-fw pi-file-import', routerLink: ['/documentos'] },
                    { label: 'Entregas', icon: 'pi pi-fw pi-envelope', routerLink: ['/entregas'] },
                    { label: 'Rutas', icon: 'pi pi-fw pi-map', routerLink: ['/rutas'] },
                    { label: 'Items', icon: 'pi pi-fw pi-barcode', routerLink: ['/items'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-warehouse', routerLink: ['/inventario'] },
                    { label: 'Devolución', icon: 'pi pi-fw pi-warehouse', routerLink: ['/devoluciones'] },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-user', routerLink: ['/proveedores'] },
                    { label: 'Transportes', icon: 'pi pi-fw pi-truck', routerLink: ['/transportes'] }
                ].filter((item) => this.canAccess(item.label))
            }
        ];
    }

    private canAccess(menuLabel: string): boolean {
        if (!this.roles.length) return false;

        if (this.roles.includes('Administrador')) return true;

        if (this.roles.includes('Conductor')) {
            return ['Entregas', 'Rutas'].includes(menuLabel);
        }

        return false;
    }

    logout() {
        this.authService.logout();
    }
}
