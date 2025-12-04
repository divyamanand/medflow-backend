import { Prescription } from './prescription.entity';
export declare class PrescriptionItem {
    id: string;
    prescription: Prescription;
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide: string | null;
    method: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
