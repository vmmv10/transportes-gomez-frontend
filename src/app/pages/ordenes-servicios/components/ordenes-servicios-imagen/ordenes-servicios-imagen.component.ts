import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { Imagen } from '../../../uikit/models/imagen.model';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-ordenes-servicios-imagen',
    imports: [CommonModule, GalleriaModule, ProgressSpinnerModule, DialogModule, ButtonModule],
    templateUrl: './ordenes-servicios-imagen.component.html',
    styleUrl: './ordenes-servicios-imagen.component.scss'
})
export class OrdenesServiciosImagenComponent {
    @Input() id: string = '';
    @Input() visible: boolean = false;
    @Output() onVisible = new EventEmitter<boolean>();
    imagenes: Imagen[] = [];
    imagenSeleccionada: Imagen | undefined;
    loading: boolean = true;

    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    constructor(private imagenesService: ImagenesService) {}

    getData(): void {
        if (this.id) {
            this.loading = true;
            this.getImagenes(this.id);
            this.loading = false;
        }
    }

    async getImagenes(id: string) {
        try {
            const data = await this.imagenesService.getImagenes(1, Number(id)).toPromise();
            this.imagenes = data ?? [];
            if (this.imagenes.length > 0) {
                this.imagenSeleccionada = this.imagenes[0];
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    hideDialog(): void {
        this.visible = false;
    }

    onImagenChange(event: any) {
        const index = event.index;
        this.imagenSeleccionada = this.imagenes[index];
    }
}
