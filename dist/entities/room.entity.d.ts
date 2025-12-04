import { Patient } from './patient.entity';
export declare enum RoomType {
    Consultation = "consultation",
    Surgery = "surgery",
    ICU = "icu",
    Ward = "ward",
    Lab = "lab",
    Storage = "storage"
}
export declare enum RoomStatus {
    Available = "available",
    Occupied = "occupied",
    Maintenance = "maintenance",
    Reserved = "reserved"
}
export declare class Room {
    id: string;
    name: string;
    type: RoomType;
    status: RoomStatus;
    capacity: number | null;
    currentPatient: Patient | null;
    createdAt: Date;
    updatedAt: Date;
}
