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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../../entities/room.entity");
let RoomService = class RoomService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(filter) {
        const qb = this.repo.createQueryBuilder('r');
        qb.where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.status)
            qb.andWhere('r.status = :st', { st: filter.status });
        if (filter === null || filter === void 0 ? void 0 : filter.type)
            qb.andWhere('r.type = :tp', { tp: filter.type });
        if (filter === null || filter === void 0 ? void 0 : filter.capacityMin)
            qb.andWhere('(r.capacity IS NOT NULL AND r.capacity >= :cmin)', { cmin: filter.capacityMin });
        if (filter === null || filter === void 0 ? void 0 : filter.capacityMax)
            qb.andWhere('(r.capacity IS NOT NULL AND r.capacity <= :cmax)', { cmax: filter.capacityMax });
        if (filter === null || filter === void 0 ? void 0 : filter.patientId)
            qb.andWhere('r.currentPatientId = :pid', { pid: filter.patientId });
        if (filter === null || filter === void 0 ? void 0 : filter.available)
            qb.andWhere('r.status = :av', { av: room_entity_1.RoomStatus.Available });
        return qb.getMany();
    }
    findOne(id) { return this.repo.findOne({ where: { id } }); }
    create(data) { const payload = this.normalizeRoomData(data); return this.repo.save(this.repo.create(payload)); }
    async update(id, data) { const payload = this.normalizeRoomData(data); await this.repo.update({ id }, payload); return this.repo.findOne({ where: { id } }); }
    async remove(id) { await this.repo.delete({ id }); return { id, removed: true }; }
    async book(id, body) {
        await this.repo.update({ id }, { status: room_entity_1.RoomStatus.Reserved });
        return this.repo.findOne({ where: { id } });
    }
    async assign(id, body) {
        const room = await this.repo.findOne({ where: { id } });
        if (!room)
            return null;
        await this.repo.update({ id }, { status: room_entity_1.RoomStatus.Occupied, currentPatient: { id: body.patientId } });
        return this.repo.findOne({ where: { id } });
    }
    async changeStatus(id, status) {
        if (!Object.values(room_entity_1.RoomStatus).includes(status))
            throw new Error('Invalid status');
        await this.repo.update({ id }, { status });
        return this.repo.findOne({ where: { id } });
    }
    findAvailable(type) {
        const qb = this.repo.createQueryBuilder('r').where('r.status = :st', { st: 'available' });
        if (type)
            qb.andWhere('r.type = :tp', { tp: type });
        return qb.getMany();
    }
    normalizeRoomData(data) {
        const out = { ...data };
        if (data && typeof data === 'object') {
            if (data.room_number && !out.roomNumber)
                out.roomNumber = data.room_number;
            if (data.current_patient_id && !out.currentPatientId)
                out.currentPatientId = data.current_patient_id;
        }
        return out;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomService);
