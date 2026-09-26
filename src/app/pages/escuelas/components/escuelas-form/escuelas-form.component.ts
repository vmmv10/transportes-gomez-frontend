import { Component } from '@angular/core';
import { Escuela } from '../../models/escuela.models';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TooltipModule } from 'primeng/tooltip';
import { EscuelasService } from '../../services/escuelas.service';
import { ToastModule } from 'primeng/toast';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ClienteSelectComponent } from '../../../clientes/components/cliente-select/cliente-select.component';
import { Cliente } from '../../../clientes/models/cliente.model';

@Component({
    selector: 'app-escuelas-form',
    imports: [CommonModule, ButtonModule, FormsModule, InputTextModule, BreadcrumbModule, RouterModule, ToastModule, ModalLoadingComponent, IconFieldModule, InputIconModule, InputGroupModule, InputGroupAddonModule, TooltipModule, ClienteSelectComponent],
    templateUrl: './escuelas-form.component.html',
    styleUrl: './escuelas-form.component.scss',
    providers: [MessageService]
})
export class EscuelasFormComponent {
    escuela: Escuela = new Escuela();
    items: MenuItem[] = [];
    loading: boolean = false;
    intentoGuardar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private escuelasService: EscuelasService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.items = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Establecimientos', routerLink: '/establecimientos' },
            { label: 'Nuevo' }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.items = [...this.items.slice(0, 2), { label: 'Editar' }];
            this.getEscuela(id);
        }
    }

    /** Para el select: basta el id, el select busca el cliente en su lista. */
    get clienteEscuela(): Cliente | undefined {
        if (!this.escuela.clienteId) {
            return undefined;
        }
        if (this.clienteSel?.id !== this.escuela.clienteId) {
            this.clienteSel = { id: this.escuela.clienteId } as Cliente;
        }
        return this.clienteSel;
    }
    private clienteSel: Cliente | undefined;

    onClienteChange(cliente: Cliente | undefined) {
        this.clienteSel = cliente;
        this.escuela.clienteId = cliente?.id;
    }

    get esNuevo(): boolean {
        return !this.escuela.id;
    }

    get emailValido(): boolean {
        return !this.escuela.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.escuela.email.trim());
    }

    get latNum(): number {
        return Number(String(this.escuela.latitud ?? '').replace(',', '.'));
    }

    get lonNum(): number {
        return Number(String(this.escuela.longitud ?? '').replace(',', '.'));
    }

    get tieneCoordenadas(): boolean {
        return !!this.latNum && !!this.lonNum;
    }

    verificarEnMapa(): void {
        if (this.tieneCoordenadas) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${this.latNum},${this.lonNum}`, '_blank', 'noopener');
        }
    }

    getEscuela(id: string) {
        this.loading = true;
        this.escuelasService.getEscuela(id).subscribe({
            next: (escuela: Escuela) => {
                this.escuela = escuela;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Escuela' });
                console.error('Error fetching escuela:', error);
                this.loading = false;
            }
        });
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.escuela.nombre?.trim() || !this.escuela.rbd?.toString().trim() || !this.emailValido) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Revisa los campos marcados en rojo.' });
            return;
        }
        this.loading = true;
        if (this.escuela.id) {
            this.escuelasService.updateEscuela(this.escuela).subscribe({
                next: (updatedEscuela: Escuela) => {
                    this.loading = false;
                    this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Establecimiento actualizado' });
                },
                error: (error) => {
                    this.loading = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar Escuela' });
                }
            });
        } else {
            this.escuelasService.createEscuela(this.escuela).subscribe({
                next: (newEscuela: Escuela) => {
                    this.loading = false;
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Establecimiento creado' });
                    // Se pasa a modo edición del nuevo registro para no crearlo dos veces
                    if (newEscuela?.id) {
                        this.escuela = newEscuela;
                        this.router.navigate(['/establecimientos/formulario/' + newEscuela.id], { replaceUrl: true });
                    }
                },
                error: (error) => {
                    this.loading = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear Escuela' });
                    console.error('Error creating escuela:', error);
                }
            });
        }
    }
}
