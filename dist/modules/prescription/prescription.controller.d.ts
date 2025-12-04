import { PrescriptionService } from './prescription.service';
export declare class PrescriptionController {
    private readonly svc;
    constructor(svc: PrescriptionService);
    list(q: any, req: any): Promise<import("../../entities/prescription.entity").Prescription[]>;
    create(body: any, req: any): Promise<import("../../entities/prescription.entity").Prescription | null>;
    getOne(id: string, req: any): Promise<import("../../entities/prescription.entity").Prescription>;
    update(id: string, body: any, req: any): Promise<import("../../entities/prescription.entity").Prescription | null>;
    remove(id: string, req: any): Promise<{
        id: string;
        removed: boolean;
    }>;
    addItem(prescriptionId: string, body: any, req: any): Promise<import("../../entities/prescription-item.entity").PrescriptionItem>;
    updateItem(prescriptionId: string, itemId: string, body: any, req: any): Promise<import("../../entities/prescription-item.entity").PrescriptionItem | null>;
    removeItem(prescriptionId: string, itemId: string, req: any): Promise<{
        id: string;
        removed: boolean;
    }>;
}
