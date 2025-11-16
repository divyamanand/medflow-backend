import { Staff } from './staff.entity';
export declare class Timings {
    id: string;
    staff: Staff | null;
    weekday: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
