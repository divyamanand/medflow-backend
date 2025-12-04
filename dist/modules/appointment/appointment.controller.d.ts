import { AppointmentService } from './appointment.service';
export declare class AppointmentController {
    private svc;
    constructor(svc: AppointmentService);
    list(q: any, req: any): Promise<{
        id: string;
        patientId: any;
        doctorId: any;
        patientName: string | null;
        doctorName: string | null;
        startAt: Date;
        endAt: Date;
        status: "scheduled" | "confirmed" | "checkedIn" | "completed" | "cancelled";
        issues: string | null;
        createdAt: any;
        updatedAt: any;
    }[]>;
    listByPatient(patientId: string, q: any, req: any): Promise<{
        id: string;
        patientId: any;
        doctorId: any;
        patientName: string | null;
        doctorName: string | null;
        startAt: Date;
        endAt: Date;
        status: "scheduled" | "confirmed" | "checkedIn" | "completed" | "cancelled";
        issues: string | null;
        createdAt: any;
        updatedAt: any;
    }[]>;
    listByDoctor(doctorId: string, q: any, req: any): Promise<{
        id: string;
        patientId: any;
        doctorId: any;
        patientName: string | null;
        doctorName: string | null;
        startAt: Date;
        endAt: Date;
        status: "scheduled" | "confirmed" | "checkedIn" | "completed" | "cancelled";
        issues: string | null;
        createdAt: any;
        updatedAt: any;
    }[]>;
    get(id: string, req: any): Promise<{
        id: string;
        patientId: any;
        doctorId: any;
        patientName: string | null;
        doctorName: string | null;
        startAt: Date;
        endAt: Date;
        status: "scheduled" | "confirmed" | "checkedIn" | "completed" | "cancelled";
        issues: string | null;
        createdAt: any;
        updatedAt: any;
    } | null>;
    createOrBook(body: any, req: any): Promise<import("../../entities/appointment.entity").Appointment>;
    findMatchingDoctors(body: {
        issues: string[];
        timeWindow?: any;
        appointment_type?: string;
    }): Promise<{
        doctorId: string;
        score: number;
        specialties: {
            id: string;
            name: string;
        }[];
    }[]>;
    nextSlots(doctorId: string, date: string, req: any): Promise<{
        startDatetime: Date;
        endDatetime: Date;
        slotDurationMinutes: number;
    }[]>;
    update(id: string, body: any, req: any): Promise<import("../../entities/appointment.entity").Appointment | null>;
    cancelWithReason(id: string, body: {
        reason?: string;
    }, req: any): Promise<any>;
    cancel(id: string, req: any): Promise<any>;
    patch(id: string, body: any, req: any): Promise<import("../../entities/appointment.entity").Appointment | null>;
    hardDelete(id: string): Promise<any>;
    confirm(id: string, req: any): Promise<import("../../entities/appointment.entity").Appointment | null>;
    checkin(id: string, req: any): Promise<import("../../entities/appointment.entity").Appointment | null>;
    complete(id: string, req: any): Promise<import("../../entities/appointment.entity").Appointment | null>;
}
