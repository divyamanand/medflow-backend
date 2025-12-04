export declare class InventoryItem {
    id: string;
    name: string;
    type: 'medicine' | 'equipment' | 'blood' | 'supply';
    manufacturer: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
