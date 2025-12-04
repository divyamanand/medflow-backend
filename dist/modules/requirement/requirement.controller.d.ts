import { RequirementService } from './requirement.service';
export declare class RequirementController {
    private readonly svc;
    constructor(svc: RequirementService);
    listItemRequirements(): Promise<import("../../entities/item-requirement.entity").ItemRequirement[]>;
    createItemRequirement(body: any): Promise<import("../../entities/item-requirement.entity").ItemRequirement>;
    getItemRequirement(id: string): Promise<import("../../entities/item-requirement.entity").ItemRequirement>;
    updateItemRequirement(id: string, body: any): Promise<import("../../entities/item-requirement.entity").ItemRequirement>;
    listItemFulfillments(id: string): Promise<import("../../entities/item-requirement-fulfillment.entity").ItemRequirementFulfillment[]>;
    createItemFulfillment(id: string, body: any): Promise<import("../../entities/item-requirement-fulfillment.entity").ItemRequirementFulfillment>;
    updateItemFulfillment(fid: string, body: any): Promise<import("../../entities/item-requirement-fulfillment.entity").ItemRequirementFulfillment>;
    listStaffRequirements(): Promise<import("../../entities/staff-requirement.entity").StaffRequirement[]>;
    createStaffRequirement(body: any): Promise<import("../../entities/staff-requirement.entity").StaffRequirement>;
    getStaffRequirement(id: string): Promise<import("../../entities/staff-requirement.entity").StaffRequirement>;
    updateStaffRequirement(id: string, body: any): Promise<import("../../entities/staff-requirement.entity").StaffRequirement>;
    listStaffFulfillments(id: string): Promise<import("../../entities/staff-requirement-fulfillment.entity").StaffRequirementFulfillment[]>;
    createStaffFulfillment(id: string, body: any): Promise<import("../../entities/staff-requirement-fulfillment.entity").StaffRequirementFulfillment>;
    updateStaffFulfillment(fid: string, body: any): Promise<import("../../entities/staff-requirement-fulfillment.entity").StaffRequirementFulfillment>;
    listRoomRequirements(): Promise<import("../../entities/room-requirement.entity").RoomRequirement[]>;
    createRoomRequirement(body: any): Promise<import("../../entities/room-requirement.entity").RoomRequirement>;
    getRoomRequirement(id: string): Promise<import("../../entities/room-requirement.entity").RoomRequirement>;
    updateRoomRequirement(id: string, body: any): Promise<import("../../entities/room-requirement.entity").RoomRequirement>;
    listRoomFulfillments(id: string): Promise<import("../../entities/room-requirement-fulfillment.entity").RoomRequirementFulfillment[]>;
    createRoomFulfillment(id: string, body: any): Promise<import("../../entities/room-requirement-fulfillment.entity").RoomRequirementFulfillment>;
    updateRoomFulfillment(fid: string, body: any): Promise<import("../../entities/room-requirement-fulfillment.entity").RoomRequirementFulfillment>;
    getItemFulfillmentsAggregate(): Promise<{
        requirementId: any;
        quantity: number;
        notes: any;
        startTime: any;
        endTime: any;
        itemId: any;
        itemName: any;
    }[]>;
    getStaffFulfillmentsAggregate(): Promise<{
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
    getRoomFulfillmentsAggregate(): Promise<{
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
}
