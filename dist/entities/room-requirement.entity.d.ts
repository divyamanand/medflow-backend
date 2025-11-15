import { RequirementStatus } from './item-requirement.entity';
export declare class RoomRequirement {
    id: string;
    primaryUserId: string;
    roomType: string;
    quantity: number;
    status: RequirementStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
