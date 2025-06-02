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
    templateUrl: './app.menu.html',

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
                    { label: 'Ordenes de Servicios', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/formlayout'] },
                    { label: 'Documentos', icon: 'pi pi-fw pi-file-import', routerLink: ['/uikit/formlayout'] },
                    { label: 'Entregas', icon: 'pi pi-fw pi-envelope', routerLink: ['/uikit/formlayout'] },
                    { label: 'Rutas', icon: 'pi pi-fw pi-map', routerLink: ['/uikit/formlayout'] },
                    { label: 'Items', icon: 'pi pi-fw pi-barcode', routerLink: ['/uikit/formlayout'] },
                    { label: 'Inventarios', icon: 'pi pi-fw pi-warehouse', routerLink: ['/uikit/formlayout'] },
                    { label: 'Transportes', icon: 'pi pi-fw pi-truck', routerLink: ['/uikit/formlayout'] },
                ]
            },
        ];
    }

    logout() {
        this.authService.logout();
    }
}
