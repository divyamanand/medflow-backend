export declare class InventoryItem {
    id: string;
    name: string;
    type: 'medicine' | 'equipment' | 'blood' | 'supply';
    quantity: number;
    unit: string | null;
    createdAt: Date;
    updatedAt: Date;
}
