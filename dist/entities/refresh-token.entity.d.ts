import { UserRole } from './user.entity';
export declare class RefreshToken {
    id: string;
    userId: string;
    userRole: UserRole;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
}
