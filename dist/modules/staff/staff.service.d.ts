import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { Timings } from '../../entities/timings.entity';
import { Leave } from '../../entities/leave.entity';
import { User, UserRole } from '../../entities/user.entity';
import { StaffRequirementFulfillment } from '../../entities/staff-requirement-fulfillment.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
export declare class StaffService {
    private repo;
    private timingsRepo;
    private leaveRepo;
    private userRepo;
    private staffFulfillRepo;
    private staffReqRepo;
    constructor(repo: Repository<Staff>, timingsRepo: Repository<Timings>, leaveRepo: Repository<Leave>, userRepo: Repository<User>, staffFulfillRepo: Repository<StaffRequirementFulfillment>, staffReqRepo: Repository<StaffRequirement>);
    create(data: any): Promise<Staff>;
    findAll(filter?: any): Promise<Staff[]>;
    findOne(id: string): Promise<Staff | null>;
    update(id: string, data: any): Promise<Staff | null>;
    private loadSpecialtiesMap;
    findAllDetailed(filter?: any): Promise<{
        id: string;
        userId: string | null;
        name: string | null;
        role: UserRole | null;
        phone: string | null;
        email: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            primary: boolean;
        }[];
    }[]>;
    findOneDetailed(id: string): Promise<{
        id: string;
        userId: string | null;
        name: string | null;
        role: UserRole | null;
        phone: string | null;
        email: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        specialties: {
            id: string;
            name: string;
            primary: boolean;
        }[];
    } | null>;
    getTimings(staffId: string): Promise<Timings[]>;
    upsertTimings(staffId: string, entries: Partial<Timings>[]): Promise<Timings[]>;
    addLeave(staffId: string, leave: Partial<Leave>): Promise<Leave>;
    createTiming(staffId: string, timing: Partial<Timings>): Promise<Timings>;
    getTimingById(staffId: string, timingId: string): Promise<Timings | null>;
    updateTiming(staffId: string, timingId: string, data: Partial<Timings>): Promise<Timings | null>;
    deleteTiming(staffId: string, timingId: string): Promise<any>;
    softDelete(id: string): Promise<any>;
    listLeaves(staffId: string): Promise<Leave[]>;
    getLeaveById(staffId: string, leaveId: string): Promise<Leave | null>;
    updateLeave(staffId: string, leaveId: string, data: Partial<Leave>): Promise<Leave | null>;
    deleteLeave(staffId: string, leaveId: string): Promise<any>;
    getTimingsTable(filter?: {
        role?: string;
        specialtyId?: string;
        weekday?: number;
    }): Promise<any[]>;
    getLeavesTable(filter?: {
        role?: string;
        specialtyId?: string;
        status?: string;
        from?: string;
        to?: string;
    }): Promise<any[]>;
}
