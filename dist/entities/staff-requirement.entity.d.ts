import { RequirementStatus } from './item-requirement.entity';
export declare class StaffRequirement {
    id: string;
    primaryUserId: string;
    roleNeeded: string;
    quantity: number;
    fulfilledCount: number;
    startTime: Date | null;
    estimatedEndTime: Date | null;
    status: RequirementStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
