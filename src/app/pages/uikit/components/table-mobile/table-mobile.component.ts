import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FechaPipe } from '../../pipe/fecha';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-table-mobile',
    imports: [FechaPipe, BadgeModule, CommonModule, PaginatorModule, TooltipModule, ButtonModule, RouterLink, TagModule],
    templateUrl: './table-mobile.component.html',
    styleUrl: './table-mobile.component.scss'
})
export class TableMobileComponent {
    @Input() data: any[] = [];
    @Input() acciones: any[] = [];
    @Input() campos: {
        etiqueta: string;
        propiedad: string;
        tipo?: 'texto' | 'moneda' | 'fecha' | 'badge' | 'objeto' | 'tag',
        profundidad?: number;
    }[] = [];
    @Input() totalElements: number = 0;
    @Input() size = 10;
    @Input() page = 0;
    @Output() pageChange = new EventEmitter<any>();
    @Output() accion = new EventEmitter<{ tipo: string; item: any }>();
    @Input() mostrarAcciones: boolean = true;
    @Input() card: boolean = true;

    onPageChange(event: any) {
        this.pageChange.emit(event);
    }

    getValor(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }

}
