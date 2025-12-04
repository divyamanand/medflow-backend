import { StaffSpecialty } from './staff-specialty.entity';
import { Timings } from './timings.entity';
import { Leave } from './leave.entity';
import { User } from './user.entity';
export declare class Staff {
    id: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    staffSpecialties: StaffSpecialty[];
    timings: Timings[];
    leaves: Leave[];
    user?: User | null;
}
