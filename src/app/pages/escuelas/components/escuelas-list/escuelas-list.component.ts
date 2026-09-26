import { Component } from '@angular/core';
import { EscuelasService } from '../../services/escuelas.service';
import { Escuela } from '../../models/escuela.models';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { EscuelaFiltro } from '../../models/escuela-filtro.model';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-escuelas-list',
    imports: [CommonModule, PanelModule, PaginatorModule, TableModule, ButtonModule, RippleModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, BreadcrumbModule, RouterModule, ModalLoadingComponent, TableMobileComponent, TooltipModule],
    templateUrl: './escuelas-list.component.html',
    styleUrl: './escuelas-list.component.scss'
})
export class EscuelasListComponent {
    escuelas!: Page<Escuela>;
    tok: string = '';
    textoBusqueda: string = '';
    items: MenuItem[] = [];
    loading: boolean = true;
    filtro: EscuelaFiltro = new EscuelaFiltro();
    filtrosVisibles: boolean = false;

    campos: any[] = [
        { etiqueta: 'Nombre', propiedad: 'nombre', tipo: 'texto' },
        { etiqueta: 'Comuna', propiedad: 'comuna', tipo: 'texto' },
        { etiqueta: 'Dirección', propiedad: 'direccion', tipo: 'texto' },
        { etiqueta: 'RBD', propiedad: 'rbd', tipo: 'texto' },
        { etiqueta: 'Telefono', propiedad: 'telefono', tipo: 'texto' }
    ];

    acciones = [
        {
            tooltip: 'Ver',
            icono: 'pi pi-eye',
            color: 'info',
            tipo: 'link',
            ruta: '/establecimientos/dashboard/',
            rutaConId: true,
            label: 'Ver',
            outlined: true,
            mostrar: true
        }
    ];

    constructor(
        private escuelasService: EscuelasService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.items = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Establecimientos', routerLink: '/establecimientos' }
        ];
    }

    async ngOnInit(): Promise<void> {
        const params = this.route.snapshot.queryParamMap;
        if (params.has('nombre')) {
            this.filtro.nombre = params.get('nombre') ?? undefined;
        }
        if (params.has('comuna')) {
            this.filtro.comuna = params.get('comuna') ?? undefined;
        }
        this.getEscuelas();
    }

    getEscuelas() {
        this.loading = true;
        this.filtro.activo = true;
        this.actualizarQueryParams();
        this.escuelasService.getEscuelas(this.filtro).subscribe({
            next: (data) => {
                this.escuelas = data;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error fetching escuelas:', error);
            }
        });
    }

    limpiarFiltros() {
        this.filtro.nombre = undefined;
        this.filtro.comuna = undefined;
        this.filtro.rbd = undefined;
        this.filtro.page = 0;
        this.getEscuelas();
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getEscuelas();
    }

    private actualizarQueryParams() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                nombre: this.filtro.nombre || null,
                comuna: this.filtro.comuna || null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
