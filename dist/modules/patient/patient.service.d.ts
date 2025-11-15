import { Repository } from 'typeorm';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { Appointment } from '../../entities/appointment.entity';
import { Prescription } from '../../entities/prescription.entity';
export declare class PatientService {
    private repo;
    private userRepo;
    private apptRepo;
    private presRepo;
    constructor(repo: Repository<Patient>, userRepo: Repository<User>, apptRepo: Repository<Appointment>, presRepo: Repository<Prescription>);
    create(data: any): Promise<Patient>;
    findAll(filter?: any): Promise<Patient[]>;
    findAllSummaries(filter?: any): Promise<any[]>;
    findOne(id: string): Promise<Patient | null>;
    update(id: string, data: Partial<Patient>): Promise<Patient | null>;
    getDoctorsFromPrescriptions(patientId: string): Promise<any>;
    isDoctorLinkedToPatient(doctorId: string, patientId: string): Promise<boolean>;
    getAppointmentsForPatient(patientId: string): Promise<Appointment[]>;
    getPrescriptionsForPatient(patientId: string): Promise<Prescription[]>;
}
