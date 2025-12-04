import { LeaveService } from './leave.service';
export declare class LeaveController {
    private readonly svc;
    constructor(svc: LeaveService);
    list(q: any): Promise<import("../../entities/leave.entity").Leave[]>;
    create(body: any): Promise<import("../../entities/leave.entity").Leave>;
    get(id: string): Promise<import("../../entities/leave.entity").Leave | null>;
    approve(id: string): Promise<import("../../entities/leave.entity").Leave | null>;
    reject(id: string, body: any): Promise<import("../../entities/leave.entity").Leave | null>;
    cancel(id: string, body: any): Promise<import("../../entities/leave.entity").Leave | null>;
    edit(id: string, body: any): Promise<import("../../entities/leave.entity").Leave | null>;
}
