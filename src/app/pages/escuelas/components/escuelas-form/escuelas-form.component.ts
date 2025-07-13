import { Component } from '@angular/core';
import { Escuela } from '../../models/escuela.models';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EscuelasService } from '../../services/escuelas.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-escuelas-form',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    BreadcrumbModule,
    RouterModule,
    ToastModule
  ],
  templateUrl: './escuelas-form.component.html',
  styleUrl: './escuelas-form.component.scss',
  providers: [
    MessageService
  ]
})
export class EscuelasFormComponent {
  escuela: Escuela = new Escuela();
  items: MenuItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private escuelasService: EscuelasService,
    private messageService: MessageService
  ) {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Establecimientos', routerLink: '/establecimientos' },
      { label: 'Formulario', routerLink: '/establecimientos/formulario' },
    ];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getEscuela(id);
    }
  }

  getEscuela(id: string) {
    this.escuelasService.getEscuela(id).subscribe({
      next: (escuela: Escuela) => {
        this.escuela = escuela;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Escuela' });
        console.error('Error fetching escuela:', error);
      }
    });
  }

  guardar() {
    if (this.escuela.id) {
      this.escuelasService.updateEscuela(this.escuela).subscribe({
        next: (updatedEscuela: Escuela) => {
          console.log('Escuela updated successfully:', updatedEscuela);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Escuela actualizada' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar Escuela' });
          console.error('Error updating escuela:', error);
        }
      });
    } else {
      this.escuelasService.createEscuela(this.escuela).subscribe({
        next: (newEscuela: Escuela) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Escuela creada' });
          console.log('Escuela created successfully:', newEscuela);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear Escuela' });
          console.error('Error creating escuela:', error);
        }
      });
    }
  }

}
