import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly svc;
    constructor(svc: InventoryService);
    list(q: any): Promise<{
        stockId: any;
        name: any;
        quantity: any;
        expiry: any;
        notes: any;
        created: any;
        updated: any;
    }[]>;
    listByType(type: string): Promise<{
        stockId: any;
        name: any;
        quantity: any;
        expiry: any;
        notes: any;
        created: any;
        updated: any;
    }[]>;
    getByName(name: string): Promise<import("../../entities/inventory-item.entity").InventoryItem[]>;
    listTransactions(q: any): Promise<import("../../entities/inventory-transaction.entity").InventoryTransaction[]>;
    removeExpired(): Promise<{
        removed: number;
        ids: string[];
    }>;
    createItem(body: {
        name: string;
        type: "medicine" | "equipment" | "blood" | "supply";
        manufacturer?: string;
        description?: string;
    }): Promise<import("../../entities/inventory-item.entity").InventoryItem>;
    getItem(id: string): Promise<import("../../entities/inventory-item.entity").InventoryItem>;
    updateItem(id: string, body: any): Promise<import("../../entities/inventory-item.entity").InventoryItem>;
    deleteItem(id: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    listStock(itemId: string): Promise<import("../../entities/inventory-stock.entity").InventoryStock[]>;
    addStock(itemId: string, body: {
        quantity: number;
        expiry?: string;
        notes?: string;
    }): Promise<import("../../entities/inventory-stock.entity").InventoryStock>;
    getStock(itemId: string, stockId: string): Promise<import("../../entities/inventory-stock.entity").InventoryStock>;
    updateStock(itemId: string, stockId: string, body: {
        quantity?: number;
        expiry?: string;
        notes?: string;
    }): Promise<import("../../entities/inventory-stock.entity").InventoryStock>;
    deleteStock(itemId: string, stockId: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    fulfillPrescription(id: string): Promise<{
        id: string;
        status: string;
    }>;
    adjust(id: string, body: {
        change: number;
        reason?: string;
        referenceId?: string;
    }): Promise<{
        itemId: string;
        adjusted: number;
    }>;
    dispense(id: string, body: {
        quantity: number;
        referenceId?: string;
    }): Promise<{
        itemId: string;
        dispensed: number;
        reference: string | undefined;
    }>;
}
