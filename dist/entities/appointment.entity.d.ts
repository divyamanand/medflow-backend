import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
export declare class Appointment {
    id: string;
    patient: Patient | null;
    doctor: Staff | null;
    startAt: Date;
    endAt: Date;
    status: 'scheduled' | 'confirmed' | 'checkedIn' | 'completed' | 'cancelled';
    cancelReason: string | null;
    issues: string | null;
    createdAt: Date;
    updatedAt: Date;
}
