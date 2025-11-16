import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { PrescriptionItem } from './prescription-item.entity';
export declare class Prescription {
    id: string;
    patient: Patient | null;
    doctor: Staff | null;
    nextReview: string | null;
    diagnosis: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    items: PrescriptionItem[];
}
