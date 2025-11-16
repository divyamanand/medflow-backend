import { Staff } from './staff.entity';
export declare class Leave {
    id: string;
    staff: Staff | null;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: 'approved' | 'pending' | 'rejected';
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
