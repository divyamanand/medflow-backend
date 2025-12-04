export declare const ROLES_KEY = "roles";
export type AppRole = 'patient' | 'doctor' | 'nurse' | 'receptionist' | 'admin' | 'lab_tech' | 'pharmacist' | 'inventory' | 'room_manager';
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
