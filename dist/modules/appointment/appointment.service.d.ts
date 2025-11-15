import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { Staff } from '../../entities/staff.entity';
import { Timings } from '../../entities/timings.entity';
import { Leave } from '../../entities/leave.entity';
import { Specialty } from '../../entities/specialty.entity';
import { LlmService } from '../llm/llm.service';
export declare class AppointmentService {
    private repo;
    private staffRepo;
    private timingsRepo;
    private leaveRepo;
    private specialtyRepo;
    private llmService;
    constructor(repo: Repository<Appointment>, staffRepo: Repository<Staff>, timingsRepo: Repository<Timings>, leaveRepo: Repository<Leave>, specialtyRepo: Repository<Specialty>, llmService: LlmService);
    create(data: Partial<Appointment>): Promise<Appointment>;
    findAll(filter?: any): Promise<Appointment[]>;
    findOne(id: string): Promise<Appointment | null>;
    findMatchingDoctorsForIssues(payload: {
        issues?: string[];
        specialty_ids?: string[];
        timeWindow?: any;
        appointment_type?: string;
    }): Promise<{
        doctorId: string;
        score: number;
        specialties: {
            id: string;
            name: string;
        }[];
    }[]>;
    getDoctorNext3Slots(doctorId: string): Promise<{
        startDatetime: Date;
        endDatetime: Date;
        slotDurationMinutes: number;
    }[]>;
    private combineDateTime;
    private alignToSlot;
    private isSlotAvailable;
    book(data: Partial<Appointment>): Promise<Appointment>;
    update(id: string, data: Partial<Appointment>): Promise<Appointment | null>;
    cancel(id: string, reason?: string): Promise<any>;
    remove(id: string): Promise<any>;
    transition(id: string, action: 'confirm' | 'checkin' | 'complete'): Promise<Appointment | null>;
}
