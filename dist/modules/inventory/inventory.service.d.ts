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
    listItems(filter?: any): Promise<{
        id: any;
        name: any;
        type: any;
        unit: any;
        quantity: number;
        expiry: any;
    }[]>;
    listByType(type: InventoryItem['type']): Promise<InventoryItem[]>;
    createItem(data: Partial<InventoryItem>): Promise<InventoryItem>;
    updateItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem | null>;
    deleteItem(id: string): Promise<any>;
    getItemByName(name: string): Promise<InventoryItem | null>;
    addStock(id: string, quantity: number, referenceId?: string, unit?: string | null, expiry?: string | null): Promise<InventoryStock | null>;
    dispenseItem(id: string, quantity: number, referenceId?: string): Promise<InventoryItem | null>;
    removeExpired(): Promise<any>;
    adjustItem(id: string, body: {
        quantity: number;
        reason?: string;
        refPrescriptionItemId?: string;
    }): Promise<InventoryItem | null>;
    listTransactions(filter?: any): Promise<InventoryTransaction[]>;
    fulfillPrescription(prescriptionId: string): Promise<any>;
}
