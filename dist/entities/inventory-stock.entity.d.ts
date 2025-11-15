import { InventoryItem } from './inventory-item.entity';
export declare class InventoryStock {
    id: string;
    inventoryItem: InventoryItem;
    quantity: number;
    unit: string | null;
    expiry: string | null;
    createdAt: Date;
    updatedAt: Date;
}
