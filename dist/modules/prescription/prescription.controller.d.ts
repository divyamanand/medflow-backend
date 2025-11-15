import { PrescriptionService } from './prescription.service';
export declare class PrescriptionController {
    private readonly svc;
    constructor(svc: PrescriptionService);
    create(body: any, req: any): Promise<import("../../entities/prescription.entity").Prescription | null>;
    list(q: any, req: any): Promise<{
        id: any;
        patientName: string | null;
        doctorName: string | null;
        date: any;
        diagnosis: any;
    }[]>;
    getOne(id: string, req: any): Promise<{
        id: string;
        patientId: any;
        doctorId: any;
        patientName: string | null;
        doctorName: string | null;
        diagnosis: string | null;
        notes: string | null;
        items: {
            id: any;
            name: any;
            dosage: any;
            duration: any;
            quantity: any;
            dayDivide: any;
            method: any;
        }[];
        date: Date;
        nextReview: string | null;
    }>;
    update(id: string, body: any, req: any): Promise<import("../../entities/prescription.entity").Prescription | null>;
    dispense(id: string): Promise<import("../../entities/prescription.entity").Prescription | null>;
}
