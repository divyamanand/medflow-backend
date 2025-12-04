"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../../entities/appointment.entity");
const invitation_entity_1 = require("../../entities/invitation.entity");
const inventory_item_entity_1 = require("../../entities/inventory-item.entity");
const inventory_transaction_entity_1 = require("../../entities/inventory-transaction.entity");
const room_entity_1 = require("../../entities/room.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const activity_entity_1 = require("../../entities/activity.entity");
const item_requirement_entity_1 = require("../../entities/item-requirement.entity");
const staff_requirement_entity_1 = require("../../entities/staff-requirement.entity");
const room_requirement_entity_1 = require("../../entities/room-requirement.entity");
let StatsService = class StatsService {
    constructor(apptRepo, inviteRepo, itemRepo, txnRepo, roomRepo, leaveRepo, actRepo, itemReqRepo, staffReqRepo, roomReqRepo) {
        this.apptRepo = apptRepo;
        this.inviteRepo = inviteRepo;
        this.itemRepo = itemRepo;
        this.txnRepo = txnRepo;
        this.roomRepo = roomRepo;
        this.leaveRepo = leaveRepo;
        this.actRepo = actRepo;
        this.itemReqRepo = itemReqRepo;
        this.staffReqRepo = staffReqRepo;
        this.roomReqRepo = roomReqRepo;
    }
    todayRange() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        return { start, end };
    }
    async todaysAppointments() {
        const { start, end } = this.todayRange();
        return this.apptRepo.createQueryBuilder('a')
            .where('a.startAt >= :start AND a.startAt < :end', { start, end })
            .orderBy('a.startAt', 'ASC')
            .getMany();
    }
    async pendingInvitations() {
        const now = new Date();
        return this.inviteRepo.createQueryBuilder('i')
            .where('i.claimedAt IS NULL')
            .andWhere('i.expiresAt > :now', { now })
            .orderBy('i.createdAt', 'DESC')
            .getMany();
    }
    async lowStockItems(threshold = 10) {
        return this.itemRepo.createQueryBuilder('it')
            .where('(it.quantity IS NULL OR it.quantity < :th)', { th: threshold })
            .orderBy('it.quantity', 'ASC')
            .getMany();
    }
    async occupiedRooms() {
        return this.roomRepo.find({ where: { status: room_entity_1.RoomStatus.Occupied } });
    }
    async staffOnLeaveToday() {
        const today = new Date().toISOString().slice(0, 10);
        return this.leaveRepo.createQueryBuilder('l')
            .where('l.status = :st', { st: 'approved' })
            .andWhere(':today BETWEEN l.startDate AND l.endDate', { today })
            .getMany();
    }
    async appointmentsLast7Days() {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        const rows = await this.apptRepo.createQueryBuilder('a')
            .select('DATE(a.startAt)', 'day')
            .addSelect('COUNT(*)', 'count')
            .where('a.startAt >= :start AND a.startAt <= :end', { start, end })
            .groupBy('DATE(a.startAt)')
            .orderBy('day', 'ASC')
            .getRawMany();
        return rows;
    }
    async inventorySummary() {
        const items = await this.itemRepo.count();
        const stockRow = await this.itemRepo.createQueryBuilder('i').select('SUM(i.quantity)', 'total').getRawOne();
        const totalStock = parseInt((stockRow === null || stockRow === void 0 ? void 0 : stockRow.total) || '0', 10);
        const soonDate = new Date();
        soonDate.setDate(soonDate.getDate() + 30);
        const soonStr = soonDate.toISOString().slice(0, 10);
        const expiringSoon = await this.itemRepo.createQueryBuilder('i')
            .where('i.expiry IS NOT NULL AND i.expiry < :soon', { soon: soonStr })
            .getCount();
        const demand = await this.txnRepo.query(`SELECT inventoryItemId, SUM(quantity) as sum_out
       FROM inventory_transaction
       WHERE type='out' AND createdAt >= (NOW() - INTERVAL '30 days')
       GROUP BY inventoryItemId
       ORDER BY sum_out DESC
       LIMIT 5`);
        return { items, totalStock, expiringSoon, mostInDemand: demand };
    }
    async recentActivities(limit = 20) {
        return this.actRepo.createQueryBuilder('a')
            .orderBy('a.createdAt', 'DESC')
            .limit(limit)
            .getMany();
    }
    async requirementsSnapshot() {
        const item = await this.statusCounts(this.itemReqRepo, 'item');
        const staff = await this.statusCounts(this.staffReqRepo, 'staff');
        const room = await this.statusCounts(this.roomReqRepo, 'room');
        return { item, staff, room };
    }
    async statusCounts(repo, label) {
        const rows = await repo.createQueryBuilder('r')
            .select('r.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('r.status')
            .getRawMany();
        return rows.reduce((acc, r) => { acc[r.status] = parseInt(r.count, 10); return acc; }, {});
    }
    async overview() {
        const [todaysAppointments, pendingInvitations, lowStock, occupiedRooms, staffOnLeave, appt7, invSummary, recentActs, reqSnap] = await Promise.all([
            this.todaysAppointments(),
            this.pendingInvitations(),
            this.lowStockItems(),
            this.occupiedRooms(),
            this.staffOnLeaveToday(),
            this.appointmentsLast7Days(),
            this.inventorySummary(),
            this.recentActivities(),
            this.requirementsSnapshot(),
        ]);
        return {
            todaysAppointments,
            pendingInvitations,
            lowStockItems: lowStock,
            occupiedRooms,
            staffOnLeave: staffOnLeave,
            appointmentsLast7Days: appt7,
            inventory: invSummary,
            recentActivities: recentActs,
            requirements: reqSnap,
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(3, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransaction)),
    __param(4, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(5, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(6, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(7, (0, typeorm_1.InjectRepository)(item_requirement_entity_1.ItemRequirement)),
    __param(8, (0, typeorm_1.InjectRepository)(staff_requirement_entity_1.StaffRequirement)),
    __param(9, (0, typeorm_1.InjectRepository)(room_requirement_entity_1.RoomRequirement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
