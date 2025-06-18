import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fecha'
})
export class FechaPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        const fecha = new Date(value);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}-${mes}-${anio}`;
    }
}
