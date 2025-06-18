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

    ngOnInit(): void {
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
                    { label: 'Inventario Merma', icon: 'pi pi-fw pi-warehouse', routerLink: ['/inventario'] },
                    { label: 'Transportes', icon: 'pi pi-fw pi-truck', routerLink: ['/transportes'] }
                ]
            }
        ];
    }

    logout() {
        this.authService.logout();
    }
}
