import { Repository } from 'typeorm';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';
export declare class PrescriptionService {
    private presRepo;
    private itemRepo;
    constructor(presRepo: Repository<Prescription>, itemRepo: Repository<PrescriptionItem>);
    findAll(filter?: any): Promise<Prescription[]>;
    create(data: {
        patientId: string;
        doctorId?: string;
        nextReview?: string;
        diagnosis?: string;
        notes?: string;
        items?: Array<{
            name: string;
            dosage: string;
            duration: string;
            quantity: number;
            dayDivide?: string;
            method?: string;
        }>;
    }): Promise<Prescription | null>;
    findOne(id: string): Promise<Prescription | null>;
    update(id: string, data: Partial<{
        nextReview: string;
        diagnosis: string;
        notes: string;
        items: Array<{
            name: string;
            dosage: string;
            duration: string;
            quantity: number;
            dayDivide?: string;
            method?: string;
        }>;
    }>): Promise<Prescription | null>;
    remove(id: string): Promise<{
        id: string;
        removed: boolean;
    }>;
    addItem(prescriptionId: string, data: {
        name: string;
        dosage: string;
        duration: string;
        quantity: number;
        dayDivide?: string;
        method?: string;
    }): Promise<PrescriptionItem>;
    updateItem(itemId: string, data: Partial<{
        name: string;
        dosage: string;
        duration: string;
        quantity: number;
        dayDivide: string;
        method: string;
    }>): Promise<PrescriptionItem | null>;
    removeItem(itemId: string): Promise<{
        id: string;
        removed: boolean;
    }>;
}
