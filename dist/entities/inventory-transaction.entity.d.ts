import { InventoryItem } from './inventory-item.entity';
export declare class InventoryTransaction {
    id: string;
    inventoryItem: InventoryItem;
    type: 'in' | 'out' | 'adjust' | 'fulfill';
    quantity: number;
    reason: string | null;
    refPrescriptionItemId: string | null;
    createdAt: Date;
}
