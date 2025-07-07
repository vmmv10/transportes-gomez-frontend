import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { MessageService } from 'primeng/api';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'app-usuarios-form',
  imports: [FormsModule, CommonModule, ButtonModule, InputTextModule, ModalLoadingComponent, ToastModule],
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.scss',
  providers: [MessageService]
})
export class UsuariosFormComponent {
  usuario: Usuario = new Usuario();
  loading: boolean = false;

  constructor(
    private usuarioService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {
    this.loading = true;
    this.usuarioService.getUsuario().subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
        this.loading = false;
      }
    });
  }

  actualizar() {
    this.loading = true;
    console.log('Actualizando usuario:', this.usuario);
    this.usuarioService.update(this.usuario).subscribe({
      next: (data) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente.' });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
        this.loading = false;
      }
    });
  }
    
}
