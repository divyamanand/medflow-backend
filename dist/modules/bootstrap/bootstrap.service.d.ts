import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Staff } from '../../entities/staff.entity';
export declare class BootstrapService {
    private readonly userRepo;
    private readonly staffRepo;
    constructor(userRepo: Repository<User>, staffRepo: Repository<Staff>);
    createAdmin(payload: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    }, secretHeader?: string): Promise<any>;
}
