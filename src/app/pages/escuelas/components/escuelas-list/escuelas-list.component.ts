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
import { RouterModule } from '@angular/router';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { EscuelaFiltro } from '../../models/escuela-filtro.model';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-escuelas-list',
    imports: [CommonModule, PaginatorModule, TableModule, ButtonModule, RippleModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, BreadcrumbModule, RouterModule, ModalLoadingComponent, TableMobileComponent],
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

    campos: any[] = [
        { etiqueta: 'Nombre', propiedad: 'nombre', tipo: 'texto' },
        { etiqueta: 'Comuna', propiedad: 'comuna', tipo: 'texto' },
        { etiqueta: 'Dirección', propiedad: 'direccion', tipo: 'texto' },
        { etiqueta: 'RBD', propiedad: 'rbd', tipo: 'texto' },
        { etiqueta: 'Telefono', propiedad: 'telefono', tipo: 'texto' },
    ];

    acciones = [
        {
            tooltip: 'Ver',
            icono: 'pi pi-eye',
            color: 'info',
            tipo: 'link',
            ruta: '/escuelas/dashboard/',
            rutaConId: true,
            label: 'Ver',
            outlined: true
        },
    ];

    constructor(
        private escuelasService: EscuelasService,
        private auth: AuthService
    ) {
        this.items = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Escuelas', routerLink: '/escuelas' }
        ];
    }

    async ngOnInit(): Promise<void> {
        this.getEscuelas();
    }

    getEscuelas() {
        this.loading = true;
        this.filtro.activo = true;
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

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getEscuelas();
    }
}
