import { Item } from "../../items/models/item.model";

export class DevolucionDetalle {
    id: string;
    item: Item;
    cantidad: number;

    constructor() {
        this.id = '';
        this.item = new Item();
        this.cantidad = 0;
    }
}