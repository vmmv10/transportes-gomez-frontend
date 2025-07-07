import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Proveedor } from '../../models/proveedor.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProveedoresService } from '../../services/proveedores.service';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-proveedor-form',
    imports: [BreadcrumbModule, FormsModule, CommonModule, InputTextModule, ButtonModule, RouterModule, ModalLoadingComponent, ToastModule],
    templateUrl: './proveedor-form.component.html',
    styleUrl: './proveedor-form.component.scss',
    providers: [MessageService],
    standalone: true
})
export class ProveedorFormComponent {
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    proveedor: Proveedor = new Proveedor();

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private proveedorServices: ProveedoresService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Proveedores', routerLink: '/proveedores' }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.getProveedor(id);
            this.breadcrumb.push({ label: 'Editar Proveedor', routerLink: `/proveedores/formulario/${id}` });
        } else {
            this.breadcrumb.push({ label: 'Nuevo Proveedor', routerLink: '/proveedores/formulario' });
        }
    }

    getProveedor(id: string) {
        this.loading = true;
        this.proveedorServices.getProveedor(id).subscribe({
            next: (proveedor: Proveedor) => {
                this.proveedor = proveedor;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener proveedor' });
                console.error('Error fetching proveedor:', error);
                this.loading = false;
            }
        });
    }

    guardarProveedor() {
        this.loading = true;
        if (this.proveedor.id) {
            this.proveedorServices.updateProveedor(this.proveedor).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado correctamente' });
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar proveedor' });
                    console.error('Error updating proveedor:', error);
                    this.loading = false;
                }
            });
        } else {
            this.proveedorServices.createProveedor(this.proveedor).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado correctamente' });
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear proveedor' });
                    console.error('Error creating proveedor:', error);
                    this.loading = false;
                }
            });
        }
    }
}
