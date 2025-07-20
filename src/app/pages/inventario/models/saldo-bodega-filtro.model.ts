import { Bodega } from "../../bodegas/models/Bodega.model";
import { Categoria } from "../../categorias/models/categoria.model";
import { Marca } from "../../marcas/models/marca.model";

export class SaldoBodegaFiltro {
    nombre: string | undefined;
    bodega: Bodega | undefined;
    marca: Marca | undefined;
    categoria: Categoria | undefined;
    page: number = 0;
    size: number = 10;
}