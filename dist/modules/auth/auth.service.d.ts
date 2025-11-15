import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { Patient } from '../../entities/patient.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { User, UserRole, UserType } from '../../entities/user.entity';
import { Invitation } from '../../entities/invitation.entity';
import { ActivityService } from '../activity/activity.service';
export declare class AuthService {
    private readonly jwt;
    private staffRepo;
    private patientRepo;
    private refreshRepo;
    private userRepo;
    private inviteRepo;
    private readonly activitySvc?;
    constructor(jwt: JwtService, staffRepo: Repository<Staff>, patientRepo: Repository<Patient>, refreshRepo: Repository<RefreshToken>, userRepo: Repository<User>, inviteRepo: Repository<Invitation>, activitySvc?: ActivityService | undefined);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        role: UserRole;
        userType: UserType;
        patientId: string;
        staffId?: undefined;
    } | {
        id: string;
        email: string;
        role: UserRole;
        userType: UserType;
        staffId: string;
        patientId?: undefined;
    } | null>;
    signAccessToken(user: any): string;
    signRefreshToken(user: any): string;
    login(body: any, res?: any): Promise<{
        user: {
            id: string;
            email: string;
            role: UserRole;
            userType: UserType;
            patientId: string;
            staffId?: undefined;
        } | {
            id: string;
            email: string;
            role: UserRole;
            userType: UserType;
            staffId: string;
            patientId?: undefined;
        };
        accessExpires: Date;
    }>;
    refreshCookie(req: any, res: any): Promise<{
        user: any;
        accessExpires: Date;
    }>;
    logout(res: any): {
        ok: boolean;
    };
    me(req: any): any;
    private setAuthCookies;
    private refreshExpiryDate;
    createSession(user: any, res: any): Promise<{
        access: string;
        refresh: string;
    }>;
    rotateTokens(user: any, res: any, currentRecord?: RefreshToken): Promise<{
        access: string;
        refresh: string;
    }>;
    register(body: any): Promise<{
        id: string;
        email: string;
        role: UserRole;
    }>;
    invite(body: any): Promise<{
        invitationId: string;
        token: string;
        expiresAt: Date;
    }>;
    acceptInvite(body: any, res: any): Promise<{
        user: any;
        accessExpires: Date;
    }>;
    requestPasswordReset(body: any, ip?: string): Promise<{
        ok: boolean;
        token: string;
    }>;
    confirmPasswordReset(body: any, res: any): Promise<{
        ok: boolean;
        user: any;
        accessExpires: Date;
    }>;
    resetPassword(body: any): Promise<{
        ok: boolean;
    }>;
    bootstrapAdmin(body: any, res: any): Promise<{
        user: any;
    }>;
}
