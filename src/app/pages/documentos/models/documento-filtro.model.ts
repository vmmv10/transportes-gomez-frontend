import { DocumentoTipo } from './documento-tipo.model';
import { Proveedor } from '../../proveedor/models/proveedor.model';
import { Escuela } from '../../escuelas/models/escuela.models';

export class DocumentoFiltro {
    id: number | undefined;
    tipo!: DocumentoTipo  | undefined;
    numero: number | undefined;
    proveedor!: Proveedor;
    escuela!: Escuela;
    asignado!: boolean;
    page: number = 0;
    size: number = 10;
}
