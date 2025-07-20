import { Documento } from "../../documentos/models/documento.model";
import { Item } from "../../items/models/item.model";

export class EmergenciaIngresosDetalle {
    id!: string;
    item: Item = new Item();
    cantidad: number = 0;
}