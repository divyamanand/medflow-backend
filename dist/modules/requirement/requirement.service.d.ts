import { Repository } from 'typeorm';
import { ItemRequirement } from '../../entities/item-requirement.entity';
import { ItemRequirementFulfillment } from '../../entities/item-requirement-fulfillment.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
import { StaffRequirementFulfillment } from '../../entities/staff-requirement-fulfillment.entity';
import { RoomRequirement } from '../../entities/room-requirement.entity';
import { RoomRequirementFulfillment } from '../../entities/room-requirement-fulfillment.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
export declare class RequirementService {
    private readonly itemReqRepo;
    private readonly itemFulfillRepo;
    private readonly invRepo;
    private readonly txnRepo;
    private readonly staffReqRepo;
    private readonly staffFulfillRepo;
    private readonly roomReqRepo;
    private readonly roomFulfillRepo;
    constructor(itemReqRepo: Repository<ItemRequirement>, itemFulfillRepo: Repository<ItemRequirementFulfillment>, invRepo: Repository<InventoryItem>, txnRepo: Repository<InventoryTransaction>, staffReqRepo: Repository<StaffRequirement>, staffFulfillRepo: Repository<StaffRequirementFulfillment>, roomReqRepo: Repository<RoomRequirement>, roomFulfillRepo: Repository<RoomRequirementFulfillment>);
    listItemRequirements(): Promise<ItemRequirement[]>;
    getItemRequirement(id: string): Promise<ItemRequirement>;
    createItemRequirement(body: Partial<ItemRequirement>): Promise<ItemRequirement>;
    updateItemRequirement(id: string, body: Partial<ItemRequirement>): Promise<ItemRequirement>;
    listItemFulfillments(requirementId: string): Promise<ItemRequirementFulfillment[]>;
    createItemFulfillment(requirementId: string, body: {
        inventoryItemId: string;
        quantity: number;
        startAt?: string | null;
        endAt?: string | null;
    }): Promise<ItemRequirementFulfillment>;
    updateItemFulfillment(fulfillmentId: string, body: {
        startAt?: string | null;
        endAt?: string | null;
        quantity?: number;
    }): Promise<ItemRequirementFulfillment>;
    private recomputeItemRequirementStatus;
    listStaffRequirements(): Promise<StaffRequirement[]>;
    getStaffRequirement(id: string): Promise<StaffRequirement>;
    createStaffRequirement(body: Partial<StaffRequirement>): Promise<StaffRequirement>;
    updateStaffRequirement(id: string, body: Partial<StaffRequirement>): Promise<StaffRequirement>;
    listStaffFulfillments(requirementId: string): Promise<StaffRequirementFulfillment[]>;
    createStaffFulfillment(requirementId: string, body: {
        staffId: string;
        startAt?: string | null;
        endAt?: string | null;
    }): Promise<StaffRequirementFulfillment>;
    updateStaffFulfillment(fulfillmentId: string, body: {
        startAt?: string | null;
        endAt?: string | null;
    }): Promise<StaffRequirementFulfillment>;
    private recomputeStaffRequirementStatus;
    listRoomRequirements(): Promise<RoomRequirement[]>;
    getRoomRequirement(id: string): Promise<RoomRequirement>;
    createRoomRequirement(body: Partial<RoomRequirement>): Promise<RoomRequirement>;
    updateRoomRequirement(id: string, body: Partial<RoomRequirement>): Promise<RoomRequirement>;
    listRoomFulfillments(requirementId: string): Promise<RoomRequirementFulfillment[]>;
    createRoomFulfillment(requirementId: string, body: {
        roomId: string;
        startAt?: string | null;
        endAt?: string | null;
    }): Promise<RoomRequirementFulfillment>;
    updateRoomFulfillment(fulfillmentId: string, body: {
        startAt?: string | null;
        endAt?: string | null;
    }): Promise<RoomRequirementFulfillment>;
    private recomputeRoomRequirementStatus;
    getItemFulfillmentsTable(): Promise<{
        requirementId: any;
        quantity: number;
        notes: any;
        startTime: any;
        endTime: any;
        itemId: any;
        itemName: any;
    }[]>;
    getStaffFulfillmentsTable(): Promise<{
        id: any;
        requirementId: any;
        staffId: any;
        startAt: any;
        endAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
        staffName: any;
        staffRole: any;
    }[]>;
    getRoomFulfillmentsTable(): Promise<{
        id: any;
        requirementId: any;
        roomId: any;
        startAt: any;
        endAt: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
        roomName: any;
    }[]>;
    listAllItemFulfillmentsRaw(): Promise<ItemRequirementFulfillment[]>;
    listAllStaffFulfillmentsRaw(): Promise<StaffRequirementFulfillment[]>;
    listAllRoomFulfillmentsRaw(): Promise<RoomRequirementFulfillment[]>;
}
