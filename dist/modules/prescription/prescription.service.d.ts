import { Repository } from 'typeorm';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
export declare class PrescriptionService {
    private presRepo;
    private itemRepo;
    private invRepo;
    private txnRepo;
    constructor(presRepo: Repository<Prescription>, itemRepo: Repository<PrescriptionItem>, invRepo: Repository<InventoryItem>, txnRepo: Repository<InventoryTransaction>);
    create(data: any): Promise<Prescription | null>;
    findOne(id: string): Promise<Prescription | null>;
    createForDoctor(data: any, doctorStaffId: string): Promise<Prescription | null>;
    findAll(filter?: any): Promise<Prescription[]>;
    update(id: string, data: any): Promise<Prescription | null>;
    dispense(id: string): Promise<Prescription | null>;
    findAllForDoctor(doctorId: string, filter?: any): Promise<Prescription[]>;
    findAllForPatient(patientId: string, filter?: any): Promise<Prescription[]>;
    findAllForDispense(filter?: any): Promise<Prescription[]>;
    isDoctorOwner(prescriptionId: string, doctorStaffId: string): Promise<boolean>;
}
