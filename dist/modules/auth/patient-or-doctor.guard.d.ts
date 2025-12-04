import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from '../../entities/patient.entity';
import { Appointment } from '../../entities/appointment.entity';
export declare class PatientOrDoctorGuard implements CanActivate {
    private patientRepo;
    private apptRepo;
    constructor(patientRepo: Repository<Patient>, apptRepo: Repository<Appointment>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
