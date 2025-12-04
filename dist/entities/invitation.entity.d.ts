import { UserRole } from './user.entity';
export declare class Invitation {
    id: string;
    token: string;
    email: string;
    role: UserRole;
    staffId: string | null;
    patientId: string | null;
    claimedAt: Date | null;
    claimedByUserId: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
