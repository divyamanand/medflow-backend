import { Staff } from './staff.entity';
import { Appointment } from './appointment.entity';
export declare enum SlotSource {
    Timings = "timings",
    AdminBlock = "admin_block",
    SystemGenerated = "system_generated"
}
export declare class AppointmentSlot {
    id: string;
    doctor: Staff;
    slotStart: Date;
    slotEnd: Date;
    isBooked: boolean;
    appointment: Appointment | null;
    source: SlotSource;
}
