import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@auth0/auth0-angular';
import { ButtonModule } from 'primeng/button';
import { puedeVer } from '../../pages/uikit/permisos';

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
                    { label: 'Establecimientos', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/establecimientos'] },
                    { label: 'Ordenes de Servicios', icon: 'pi pi-fw pi-file', routerLink: ['/ordenes-servicios'] },
                    { label: 'Documentos', icon: 'pi pi-fw pi-file-import', routerLink: ['/documents'] },
                    { label: 'Entregas', icon: 'pi pi-fw pi-envelope', routerLink: ['/entregas'] },
                    { label: 'Devoluciones', icon: 'pi pi-fw pi-replay', routerLink: ['/devoluciones'] },
                    { label: 'Rutas', icon: 'pi pi-fw pi-map', routerLink: ['/rutas'] },
                    {
                        label: 'Articulos',
                        icon: 'pi pi-fw pi-warehouse',
                        items: [
                            { label: 'Lista de Artículos', routerLink: ['/items'] },
                            { label: 'Entregados', routerLink: ['/items/entregados'] },
                            { label: 'Marcas', routerLink: ['/marcas'] },
                            { label: 'Categorías', routerLink: ['/categorias'] }
                        ]
                    },
                    { label: 'Inventario', icon: 'pi pi-fw pi-warehouse', routerLink: ['/inventario'] },
                    { label: 'Ingresos', icon: 'pi pi-fw pi-cart-minus', routerLink: ['/ingresos'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-briefcase', routerLink: ['/clientes'] },
                    { label: 'Contratos', icon: 'pi pi-fw pi-file-edit', routerLink: ['/contratos'] },
                    { label: 'Destinos', icon: 'pi pi-fw pi-map-marker', routerLink: ['/destinos'] },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-user', routerLink: ['/proveedores'] },
                    {
                        label: 'Comercial',
                        icon: 'pi pi-fw pi-dollar',
                        items: [
                            { label: 'Cotizaciones', icon: 'pi pi-fw pi-calculator', routerLink: ['/comercial/cotizaciones'] },
                            { label: 'Tarifas', icon: 'pi pi-fw pi-tag', routerLink: ['/comercial/tarifas'] },
                            { label: 'Mensajes web', icon: 'pi pi-fw pi-envelope', routerLink: ['/comercial/mensajes'] }
                        ]
                    },
                    {
                        label: 'Transportes',
                        icon: 'pi pi-fw pi-truck',
                        items: [
                            { label: 'Vehículos', icon: 'pi pi-fw pi-car', routerLink: ['/vehiculos'] },
                            { label: 'Costos de ruta', icon: 'pi pi-fw pi-wallet', routerLink: ['/costos-rutas'] }
                        ]
                    },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/usuarios'] }
                    //{ label: 'Mantencion', icon: 'pi pi-fw pi-wrench', items: [{ label: 'Categorías OS', routerLink: ['mantencion/categorias-os'] }] }
                ].filter((item) => this.canAccess(item.label))
            }
        ];
    }

    /** Según la tabla de permisos (pages/uikit/permisos.ts). */
    private canAccess(menuLabel: string): boolean {
        return puedeVer(menuLabel, this.roles);
    }

    logout() {
        this.authService.logout();
    }
}
