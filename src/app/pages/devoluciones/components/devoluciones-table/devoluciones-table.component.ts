import { Component, Input } from '@angular/core';
import { Page } from '../../../uikit/models/page.model';
import { DevolucionesService } from '../../services/devoluciones.service';

@Component({
    selector: 'app-devoluciones-table',
    imports: [],
    templateUrl: './devoluciones-table.component.html',
    styleUrl: './devoluciones-table.component.scss'
})
export class DevolucionesTableComponent {
    @Input() agregar: boolean = false;
    @Input() titulo: boolean = false;
    @Input() filtros: boolean = false;
    data!: Page<any>;

    constructor(private devolucionesService: DevolucionesService) {}

    getData() {}
}
