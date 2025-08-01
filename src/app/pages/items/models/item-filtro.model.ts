import { Categoria } from '../../categorias/models/categoria.model';
import { Marca } from '../../marcas/models/marca.model';

export class ItemFiltro {
    nombre: string | undefined;
    activo: boolean | undefined;
    size: number = 10;
    page: number = 0;
    marca: Marca | undefined;
    categoria: Categoria | undefined;
    codigo: string | undefined;
    sort: string = 'desc';
    key: string = 'id';
}
