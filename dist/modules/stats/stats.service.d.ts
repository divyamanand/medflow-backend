import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { Invitation } from '../../entities/invitation.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
import { Room } from '../../entities/room.entity';
import { Leave } from '../../entities/leave.entity';
import { Activity } from '../../entities/activity.entity';
import { ItemRequirement } from '../../entities/item-requirement.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
import { RoomRequirement } from '../../entities/room-requirement.entity';
export declare class StatsService {
    private apptRepo;
    private inviteRepo;
    private itemRepo;
    private txnRepo;
    private roomRepo;
    private leaveRepo;
    private actRepo;
    private itemReqRepo;
    private staffReqRepo;
    private roomReqRepo;
    constructor(apptRepo: Repository<Appointment>, inviteRepo: Repository<Invitation>, itemRepo: Repository<InventoryItem>, txnRepo: Repository<InventoryTransaction>, roomRepo: Repository<Room>, leaveRepo: Repository<Leave>, actRepo: Repository<Activity>, itemReqRepo: Repository<ItemRequirement>, staffReqRepo: Repository<StaffRequirement>, roomReqRepo: Repository<RoomRequirement>);
    private todayRange;
    todaysAppointments(): Promise<Appointment[]>;
    pendingInvitations(): Promise<Invitation[]>;
    lowStockItems(threshold?: number): Promise<InventoryItem[]>;
    occupiedRooms(): Promise<Room[]>;
    staffOnLeaveToday(): Promise<Leave[]>;
    appointmentsLast7Days(): Promise<any[]>;
    inventorySummary(): Promise<{
        items: number;
        totalStock: number;
        expiringSoon: number;
        mostInDemand: any;
    }>;
    recentActivities(limit?: number): Promise<Activity[]>;
    requirementsSnapshot(): Promise<{
        item: any;
        staff: any;
        room: any;
    }>;
    private statusCounts;
    overview(): Promise<{
        todaysAppointments: Appointment[];
        pendingInvitations: Invitation[];
        lowStockItems: InventoryItem[];
        occupiedRooms: Room[];
        staffOnLeave: Leave[];
        appointmentsLast7Days: any[];
        inventory: {
            items: number;
            totalStock: number;
            expiringSoon: number;
            mostInDemand: any;
        };
        recentActivities: Activity[];
        requirements: {
            item: any;
            staff: any;
            room: any;
        };
    }>;
}
