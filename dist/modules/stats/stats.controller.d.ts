import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly svc;
    constructor(svc: StatsService);
    overview(): Promise<{
        todaysAppointments: import("../../entities/appointment.entity").Appointment[];
        pendingInvitations: import("../../entities/invitation.entity").Invitation[];
        lowStockItems: import("../../entities/inventory-item.entity").InventoryItem[];
        occupiedRooms: import("../../entities/room.entity").Room[];
        staffOnLeave: import("../../entities/leave.entity").Leave[];
        appointmentsLast7Days: any[];
        inventory: {
            items: number;
            totalStock: number;
            expiringSoon: number;
            mostInDemand: any;
        };
        recentActivities: import("../../entities/activity.entity").Activity[];
        requirements: {
            item: any;
            staff: any;
            room: any;
        };
    }>;
    todaysAppointments(): Promise<import("../../entities/appointment.entity").Appointment[]>;
    last7(): Promise<any[]>;
    pendingInvites(): Promise<import("../../entities/invitation.entity").Invitation[]>;
    lowStock(threshold?: string): Promise<import("../../entities/inventory-item.entity").InventoryItem[]>;
    inventorySummary(): Promise<{
        items: number;
        totalStock: number;
        expiringSoon: number;
        mostInDemand: any;
    }>;
    occupiedRooms(): Promise<import("../../entities/room.entity").Room[]>;
    staffOnLeave(): Promise<import("../../entities/leave.entity").Leave[]>;
    recentActivities(): Promise<import("../../entities/activity.entity").Activity[]>;
    requirementsSnapshot(): Promise<{
        item: any;
        staff: any;
        room: any;
    }>;
}
