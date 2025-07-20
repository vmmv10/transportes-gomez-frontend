import { Item } from "../../items/models/item.model";

export class SaldoBodega {
    item: Item;
    saldo: number;
    id: number;

    constructor() {
        this.item = new Item();
        this.saldo = 0;
        this.id = 0;
    }
}