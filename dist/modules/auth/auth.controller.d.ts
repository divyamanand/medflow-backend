import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly svc;
    constructor(svc: AuthService);
    login(body: any, res: any): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../entities/user.entity").UserRole;
            userType: import("../../entities/user.entity").UserType;
            patientId: string;
            staffId?: undefined;
        } | {
            id: string;
            email: string;
            role: import("../../entities/user.entity").UserRole;
            userType: import("../../entities/user.entity").UserType;
            staffId: string;
            patientId?: undefined;
        };
        accessExpires: Date;
    }>;
    refresh(req: any, res: any): Promise<{
        user: any;
        accessExpires: Date;
    }>;
    register(body: any): Promise<{
        id: string;
        email: string;
        role: import("../../entities/user.entity").UserRole;
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
    requestPasswordReset(body: any, req: any): Promise<{
        ok: boolean;
        token: string;
    }>;
    confirmPasswordReset(body: any, res: any): Promise<{
        ok: boolean;
        user: any;
        accessExpires: Date;
    }>;
    logout(res: any): {
        ok: boolean;
    };
    me(req: any): any;
    bootstrapAdmin(body: any, res: any): Promise<{
        user: any;
    }>;
    resetPassword(body: any): Promise<{
        ok: boolean;
    }>;
}
