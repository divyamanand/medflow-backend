import { PatientService } from './patient.service';
export declare class PatientController {
    private svc;
    constructor(svc: PatientService);
    list(q: any): Promise<any[]>;
    get(id: string, req: any): Promise<any>;
    create(body: any): Promise<import("../../entities/patient.entity").Patient>;
    update(id: string, body: any, req: any): Promise<import("../../entities/patient.entity").Patient | null>;
    doctorsFromPrescription(id: string, req: any): Promise<any>;
    prescriptions(id: string, req: any): Promise<import("../../entities/prescription.entity").Prescription[]>;
    remove(id: string): Promise<any>;
}
