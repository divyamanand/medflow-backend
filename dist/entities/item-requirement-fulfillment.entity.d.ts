import { ItemRequirement } from './item-requirement.entity';
import { InventoryItem } from './inventory-item.entity';
export declare class ItemRequirementFulfillment {
    id: string;
    requirement: ItemRequirement;
    inventoryItem: InventoryItem;
    quantity: number;
    startAt: Date | null;
    endAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
