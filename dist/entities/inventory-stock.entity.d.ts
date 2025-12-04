import { InventoryItem } from './inventory-item.entity';
export declare class InventoryStock {
    id: string;
    inventoryItem: InventoryItem;
    quantity: number;
    expiry: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
