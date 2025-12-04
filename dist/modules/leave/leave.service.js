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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_entity_1 = require("../../entities/leave.entity");
const staff_entity_1 = require("../../entities/staff.entity");
let LeaveService = class LeaveService {
    constructor(leaveRepo, staffRepo) {
        this.leaveRepo = leaveRepo;
        this.staffRepo = staffRepo;
    }
    async create(data) {
        const { staffId, startDate, endDate, reason } = data || {};
        if (!staffId || !startDate || !endDate)
            throw new common_1.BadRequestException('staffId,startDate,endDate required');
        const staff = await this.staffRepo.findOne({ where: { id: staffId } });
        if (!staff)
            throw new common_1.BadRequestException('Invalid staffId');
        const leave = this.leaveRepo.create({ staff: { id: staffId }, startDate, endDate, reason: reason !== null && reason !== void 0 ? reason : null, status: 'pending' });
        return this.leaveRepo.save(leave);
    }
    async list(filter) {
        const qb = this.leaveRepo.createQueryBuilder('l').leftJoinAndSelect('l.staff', 'staff');
        qb.where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.staffId)
            qb.andWhere('l.staffId = :sid', { sid: filter.staffId });
        if (filter === null || filter === void 0 ? void 0 : filter.status)
            qb.andWhere('l.status = :st', { st: filter.status });
        if (filter === null || filter === void 0 ? void 0 : filter.from)
            qb.andWhere('l.startDate >= :from', { from: filter.from });
        if (filter === null || filter === void 0 ? void 0 : filter.to)
            qb.andWhere('l.endDate <= :to', { to: filter.to });
        if ((filter === null || filter === void 0 ? void 0 : filter.active) === true) {
            const today = new Date().toISOString().slice(0, 10);
            qb.andWhere(':today BETWEEN l.startDate AND l.endDate', { today });
        }
        return qb.getMany();
    }
    findOne(id) { return this.leaveRepo.findOne({ where: { id }, relations: ['staff'] }); }
    async update(id, data) {
        await this.leaveRepo.update({ id }, data);
        return this.findOne(id);
    }
    async transition(id, action, reason) {
        var _a;
        const leave = await this.findOne(id);
        if (!leave)
            throw new common_1.BadRequestException('leave not found');
        const statusMap = { approve: 'approved', reject: 'rejected', cancel: 'cancelled' };
        const next = statusMap[action];
        if (!next)
            throw new common_1.BadRequestException('invalid action');
        await this.leaveRepo.update({ id }, { status: next, notes: (_a = reason !== null && reason !== void 0 ? reason : leave.notes) !== null && _a !== void 0 ? _a : null });
        return this.findOne(id);
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeaveService);
