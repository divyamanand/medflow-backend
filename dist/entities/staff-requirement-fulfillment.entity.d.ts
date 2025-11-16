import { StaffRequirement } from './staff-requirement.entity';
import { Staff } from './staff.entity';
export declare class StaffRequirementFulfillment {
    id: string;
    requirement: StaffRequirement;
    staff: Staff;
    startAt: Date | null;
    endAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
