import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ClienteSelectComponent } from '../../../clientes/components/cliente-select/cliente-select.component';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { ROLES_DESCRIPCION, UsuarioAdmin } from '../../models/usuario-admin.model';
import { UsuariosAdminService } from '../../services/usuarios-admin.service';

@Component({
    standalone: true,
    selector: 'app-usuarios-admin',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbModule,
        ButtonModule,
        CheckboxModule,
        ConfirmDialogModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TableModule,
        TagModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        ClienteSelectComponent
    ],
    templateUrl: './usuarios-admin.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UsuariosAdminComponent implements OnInit {
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Usuarios', routerLink: '/usuarios' }
    ];
    loading: boolean = false;
    usuarios: UsuarioAdmin[] = [];
    filtrados: UsuarioAdmin[] = [];
    busqueda: string = '';
    rolesDisponibles: string[] = [];
    descripcion = ROLES_DESCRIPCION;

    dialogoVisible: boolean = false;
    usuario: UsuarioAdmin = new UsuarioAdmin();
    cliente: Cliente | undefined;
    intentoGuardar: boolean = false;
    guardando: boolean = false;

    constructor(
        private usuariosAdminService: UsuariosAdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.usuariosAdminService.roles().subscribe({
            next: (roles) => (this.rolesDisponibles = roles),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudieron obtener los roles de Auth0') })
        });
        this.getData();
    }

    getData() {
        this.loading = true;
        this.usuariosAdminService.listar().subscribe({
            next: (usuarios) => {
                this.usuarios = usuarios;
                this.filtrar();
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener los usuarios'), life: 8000 });
            }
        });
    }

    filtrar() {
        const texto = this.busqueda.trim().toLowerCase();
        this.filtrados = !texto ? this.usuarios : this.usuarios.filter((u) => [u.nombre, u.apellidos, u.email, u.clienteNombre, ...(u.roles ?? [])].some((v) => (v ?? '').toLowerCase().includes(texto)));
    }

    nombreCompleto(u: UsuarioAdmin): string {
        return `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    }

    severidadRol(rol: string): 'danger' | 'info' | 'warn' | 'success' | 'secondary' | 'contrast' {
        switch (rol) {
            case 'Administrador':
                return 'danger';
            case 'Operaciones':
                return 'info';
            case 'Bodega':
                return 'warn';
            case 'Conductor':
                return 'success';
            case 'Cliente':
                return 'contrast';
            default:
                return 'secondary';
        }
    }

    get esNuevo(): boolean {
        return !this.usuario.id;
    }

    get tieneRolCliente(): boolean {
        return this.usuario.roles.includes('Cliente');
    }

    get emailOk(): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((this.usuario.email ?? '').trim());
    }

    nuevo() {
        this.usuario = new UsuarioAdmin();
        this.cliente = undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    editar(u: UsuarioAdmin) {
        this.usuario = Object.assign(new UsuarioAdmin(), u, { roles: [...(u.roles ?? [])] });
        this.cliente = u.clienteId ? ({ id: u.clienteId, razonSocial: u.clienteNombre ?? '' } as Cliente) : undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    onClienteChange(cliente: Cliente | undefined) {
        this.cliente = cliente;
        this.usuario.clienteId = cliente?.id;
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.emailOk || !this.usuario.roles.length || (this.tieneRolCliente && !this.usuario.clienteId)) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Revisa los campos marcados en rojo.' });
            return;
        }
        if (!this.tieneRolCliente) {
            this.usuario.clienteId = undefined;
        }
        this.guardando = true;
        const eraNuevo = this.esNuevo;
        const peticion = eraNuevo ? this.usuariosAdminService.crear(this.usuario) : this.usuariosAdminService.actualizar(this.usuario);
        peticion.subscribe({
            next: () => {
                this.guardando = false;
                this.dialogoVisible = false;
                this.messageService.add({
                    severity: 'success',
                    summary: eraNuevo ? 'Usuario creado' : 'Usuario actualizado',
                    detail: eraNuevo ? `Se envió a ${this.usuario.email} el correo para crear su contraseña` : 'Los cambios de rol se aplican la próxima vez que inicie sesión',
                    life: 7000
                });
                this.getData();
            },
            error: (error) => {
                this.guardando = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el usuario'), life: 8000 });
            }
        });
    }

    confirmarBloqueo(u: UsuarioAdmin) {
        const bloquear = !u.bloqueado;
        this.confirmationService.confirm({
            key: 'cUsuario',
            header: bloquear ? 'Bloquear usuario' : 'Desbloquear usuario',
            message: bloquear ? `${u.email} no podrá iniciar sesión hasta que lo desbloquees.` : `${u.email} podrá volver a iniciar sesión.`,
            accept: () => {
                if (!u.id) {
                    return;
                }
                this.loading = true;
                const peticion = bloquear ? this.usuariosAdminService.bloquear(u.id) : this.usuariosAdminService.desbloquear(u.id);
                peticion.subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Listo', detail: bloquear ? 'Usuario bloqueado' : 'Usuario desbloqueado' });
                        this.getData();
                    },
                    error: (error) => {
                        this.loading = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo cambiar el estado del usuario') });
                    }
                });
            }
        });
    }

    confirmarCorreo(u: UsuarioAdmin) {
        this.confirmationService.confirm({
            key: 'cUsuario',
            header: 'Correo de contraseña',
            message: `¿Enviar a ${u.email} el correo para crear o cambiar su contraseña?`,
            accept: () => {
                if (!u.id) {
                    return;
                }
                this.loading = true;
                this.usuariosAdminService.enviarCorreoClave(u.id).subscribe({
                    next: () => {
                        this.loading = false;
                        this.messageService.add({ severity: 'success', summary: 'Correo enviado', detail: `Se envió el correo a ${u.email}` });
                    },
                    error: (error) => {
                        this.loading = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo enviar el correo') });
                    }
                });
            }
        });
    }
}
