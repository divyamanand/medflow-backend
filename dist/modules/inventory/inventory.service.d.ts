import { Repository } from 'typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
import { InventoryStock } from '../../entities/inventory-stock.entity';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';
export declare class InventoryService {
    private itemRepo;
    private txnRepo;
    private stockRepo;
    private presRepo;
    private presItemRepo;
    constructor(itemRepo: Repository<InventoryItem>, txnRepo: Repository<InventoryTransaction>, stockRepo: Repository<InventoryStock>, presRepo: Repository<Prescription>, presItemRepo: Repository<PrescriptionItem>);
    listItemsWithAggregates(filter?: any): Promise<{
        name: any;
        quantity: number;
        expiry: any;
    }[]>;
    listStocks(filter?: any): Promise<{
        stockId: any;
        name: any;
        quantity: any;
        expiry: any;
        notes: any;
        created: any;
        updated: any;
    }[]>;
    createItem(data: {
        name: string;
        type: InventoryItem['type'];
        manufacturer?: string;
        description?: string;
    }): Promise<InventoryItem>;
    getItem(id: string): Promise<InventoryItem>;
    updateItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem>;
    deleteItem(id: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    searchItemsByName(keyword: string): Promise<InventoryItem[]>;
    listStock(itemId: string): Promise<InventoryStock[]>;
    addStock(itemId: string, quantity: number, expiry?: string, notes?: string): Promise<InventoryStock>;
    getStock(stockId: string): Promise<InventoryStock>;
    updateStock(stockId: string, data: {
        quantity?: number;
        expiry?: string;
        notes?: string;
    }): Promise<InventoryStock>;
    deleteStock(stockId: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    dispenseItem(itemId: string, quantity: number, referenceId?: string): Promise<{
        itemId: string;
        dispensed: number;
        reference: string | undefined;
    }>;
    adjustItem(itemId: string, body: {
        quantity: number;
        reason?: string;
        refPrescriptionItemId?: string;
    }): Promise<{
        itemId: string;
        adjusted: number;
    }>;
    removeExpiredStocks(): Promise<{
        removed: number;
        ids: string[];
    }>;
    listTransactions(filter?: any): Promise<InventoryTransaction[]>;
    fulfillPrescription(prescriptionId: string): Promise<{
        id: string;
        status: string;
    }>;
}
