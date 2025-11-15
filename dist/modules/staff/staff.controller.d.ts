import { StaffService } from './staff.service';
export declare class StaffController {
    private svc;
    constructor(svc: StaffService);
    list(req: any, q: any): Promise<{
        id: string;
        name: string | null;
        role: import("../../entities/user.entity").UserRole | null;
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
    get(id: string, req: any): Promise<{
        id: string;
        name: string | null;
        role: import("../../entities/user.entity").UserRole | null;
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
    create(body: any): Promise<import("../../entities/staff.entity").Staff>;
    update(id: string, body: any, req: any): Promise<import("../../entities/staff.entity").Staff | null>;
    getTimings(id: string, req: any): Promise<import("../../entities/timings.entity").Timings[]>;
    upsertTimings(id: string, body: any[], req: any): Promise<import("../../entities/timings.entity").Timings[]>;
    createTiming(id: string, body: any, req: any): Promise<import("../../entities/timings.entity").Timings>;
    getTiming(id: string, timingId: string, req: any): Promise<import("../../entities/timings.entity").Timings | null>;
    updateTiming(id: string, timingId: string, body: any, req: any): Promise<import("../../entities/timings.entity").Timings | null>;
    deleteTiming(id: string, timingId: string, req: any): Promise<any>;
    listLeaves(id: string, req: any): Promise<import("../../entities/leave.entity").Leave[]>;
    addLeave(id: string, body: any, req: any): Promise<import("../../entities/leave.entity").Leave>;
    getLeave(id: string, leaveId: string, req: any): Promise<import("../../entities/leave.entity").Leave | null>;
    updateLeave(id: string, leaveId: string, body: any, req: any): Promise<import("../../entities/leave.entity").Leave | null>;
    deleteLeave(id: string, leaveId: string, req: any): Promise<any>;
}
