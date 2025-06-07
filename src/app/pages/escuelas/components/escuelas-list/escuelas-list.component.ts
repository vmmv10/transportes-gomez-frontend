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

@Component({
    selector: 'app-escuelas-list',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, BreadcrumbModule, RouterModule],
    templateUrl: './escuelas-list.component.html',
    styleUrl: './escuelas-list.component.scss'
})
export class EscuelasListComponent {
    escuelas: Escuela[] = [];
    tok: string = '';
    textoBusqueda: string = '';
    items: MenuItem[] = [];

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
        this.escuelasService.getEscuelasList().subscribe({
            next: (escuelas: Escuela[]) => {
                this.escuelas = escuelas;
            },
            error: (error) => {
                console.error('Error fetching escuelas:', error);
            }
        });
    }
}
