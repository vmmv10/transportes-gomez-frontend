import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Usuario } from '../../models/usuario.model';
import { MessageService } from 'primeng/api';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
    selector: 'app-usuarios-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './usuarios-select.component.html',
    styleUrl: './usuarios-select.component.scss',
    providers: [MessageService]
})
export class UsuariosSelectComponent {
    @Input() usuario: Usuario | undefined;
    @Input() rol: string = '';
    @Output() usuarioChange = new EventEmitter<Usuario>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;
    @Input() disabled: boolean = false;
    filtro: Usuario = new Usuario();

    usuarios: Usuario[] = [];
    loading: boolean = true;

    constructor(
        private messageService: MessageService,
        private usuariosService: UsuariosService
    ) {}

    ngOnInit() {
        this.filtro.rol = this.rol;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.usuariosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.usuarios = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los usuarios' });
                console.error('Error fetching usuarios:', error);
                this.loading = false;
            }
        });
    }

    onChangeSelect(usuario: Usuario) {
        this.usuario = usuario;
        this.usuarioChange.emit(usuario);
    }
}
