import { Item } from '../../items/models/item.model';

export class IngresoDetalle {
    id!: string;
    item: Item = new Item();
    cantidad: number = 0;
    saldo: number = 0;
}
