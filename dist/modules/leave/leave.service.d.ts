import { Repository } from 'typeorm';
import { Leave } from '../../entities/leave.entity';
import { Staff } from '../../entities/staff.entity';
export declare class LeaveService {
    private leaveRepo;
    private staffRepo;
    constructor(leaveRepo: Repository<Leave>, staffRepo: Repository<Staff>);
    create(data: any): Promise<Leave>;
    list(filter?: any): Promise<Leave[]>;
    findOne(id: string): Promise<Leave | null>;
    update(id: string, data: any): Promise<Leave | null>;
    transition(id: string, action: 'approve' | 'reject' | 'cancel', reason?: string): Promise<Leave | null>;
}
