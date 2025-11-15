import { Staff } from './staff.entity';
import { Patient } from './patient.entity';
export declare enum UserRole {
    Admin = "admin",
    Receptionist = "receptionist",
    Pharmacist = "pharmacist",
    Inventory = "inventory",
    Doctor = "doctor",
    Nurse = "nurse",
    LabTech = "lab_tech",
    RoomManager = "room_manager",
    Patient = "patient"
}
export declare enum UserType {
    Staff = "staff",
    Patient = "patient"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    phone: string | null;
    role: UserRole;
    type: UserType;
    createdAt: Date;
    updatedAt: Date;
    staff?: Staff;
    patient?: Patient;
}
