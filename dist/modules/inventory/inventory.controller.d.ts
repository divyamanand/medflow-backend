import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly svc;
    constructor(svc: InventoryService);
    list(q: any): Promise<{
        name: any;
        quantity: number;
        unit: any;
        expiry: any;
    }[]>;
    listByType(type: string): Promise<{
        name: any;
        quantity: number;
        unit: any;
        expiry: any;
    }[]>;
    create(body: any): Promise<import("../../entities/inventory-item.entity").InventoryItem>;
    update(id: string, body: any): Promise<import("../../entities/inventory-item.entity").InventoryItem | null>;
    remove(id: string): Promise<any>;
    getByName(name: string): Promise<import("../../entities/inventory-item.entity").InventoryItem | null>;
    adjust(id: string, body: {
        change: number;
        reason?: string;
        referenceId?: string;
    }): Promise<import("../../entities/inventory-item.entity").InventoryItem | null>;
    addStock(id: string, body: {
        quantity: number;
        referenceId?: string;
        unit?: string | null;
        expiry?: string | null;
    }): Promise<import("../../entities/inventory-stock.entity").InventoryStock | null>;
    dispense(id: string, body: {
        quantity: number;
        referenceId?: string;
    }): Promise<import("../../entities/inventory-item.entity").InventoryItem | null>;
    removeExpired(): Promise<any>;
    fulfillPrescription(id: string): Promise<any>;
    listTransactions(q: any): Promise<import("../../entities/inventory-transaction.entity").InventoryTransaction[]>;
}
