import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-camara',
    imports: [CommonModule, ButtonModule],
    templateUrl: './camara.component.html',
    styleUrl: './camara.component.scss'
})
export class CamaraComponent {
    @Output() onFotoTomada = new EventEmitter<File>();
    archivo: File | null = null;
    imagenBase64: string | null = null;

    archivoSeleccionado(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.archivo = input.files[0];
            this.onFotoTomada.emit(this.archivo);

            const reader = new FileReader();
            reader.onload = () => {
                this.imagenBase64 = reader.result as string;
            };
            reader.readAsDataURL(this.archivo);
        }
    }
}
