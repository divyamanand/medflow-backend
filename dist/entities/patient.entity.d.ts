import { Staff } from './staff.entity';
import { User } from './user.entity';
export declare class Patient {
    id: string;
    primaryPhysician: Staff | null;
    createdAt: Date;
    updatedAt: Date;
    user?: User | null;
}
