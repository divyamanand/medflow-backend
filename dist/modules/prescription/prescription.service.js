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
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prescription_entity_1 = require("../../entities/prescription.entity");
const prescription_item_entity_1 = require("../../entities/prescription-item.entity");
const inventory_item_entity_1 = require("../../entities/inventory-item.entity");
const inventory_transaction_entity_1 = require("../../entities/inventory-transaction.entity");
let PrescriptionService = class PrescriptionService {
    constructor(presRepo, itemRepo, invRepo, txnRepo) {
        this.presRepo = presRepo;
        this.itemRepo = itemRepo;
        this.invRepo = invRepo;
        this.txnRepo = txnRepo;
    }
    async create(data) {
        const items = Array.isArray(data === null || data === void 0 ? void 0 : data.items) ? data.items : null;
        const payload = { ...data };
        delete payload.items;
        if ((data === null || data === void 0 ? void 0 : data.patientId) && !payload.patient)
            payload.patient = { id: data.patientId };
        if ((data === null || data === void 0 ? void 0 : data.doctorId) && !payload.doctor)
            payload.doctor = { id: data.doctorId };
        const pres = await this.presRepo.save(this.presRepo.create(payload));
        if (items && items.length) {
            const now = new Date();
            const toSave = items.map((it) => {
                var _a, _b;
                return this.itemRepo.create({
                    prescription: { id: pres.id },
                    name: it.name,
                    dosage: it.dosage,
                    duration: it.duration,
                    quantity: it.quantity,
                    dayDivide: (_a = it.dayDivide) !== null && _a !== void 0 ? _a : null,
                    method: (_b = it.method) !== null && _b !== void 0 ? _b : null,
                    createdAt: now,
                    updatedAt: now,
                });
            });
            await this.itemRepo.save(toSave);
        }
        return this.findOne(pres.id);
    }
    findOne(id) {
        return this.presRepo.findOne({ where: { id }, relations: ['items', 'patient', 'patient.user', 'doctor', 'doctor.user'] });
    }
    async createForDoctor(data, doctorStaffId) {
        const payload = { ...data };
        if (doctorStaffId)
            payload.doctor = { id: doctorStaffId };
        if (data === null || data === void 0 ? void 0 : data.patientId)
            payload.patient = { id: data.patientId };
        return this.create(payload);
    }
    findAll(filter) {
        const qb = this.presRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.patient', 'patient')
            .leftJoinAndSelect('patient.user', 'puser')
            .leftJoinAndSelect('p.doctor', 'doctor')
            .leftJoinAndSelect('doctor.user', 'duser')
            .leftJoinAndSelect('p.items', 'items');
        qb.where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.patientId)
            qb.andWhere('p.patientId = :pid', { pid: filter.patientId });
        if (filter === null || filter === void 0 ? void 0 : filter.doctorId)
            qb.andWhere('p.doctorId = :did', { did: filter.doctorId });
        if (filter === null || filter === void 0 ? void 0 : filter.from)
            qb.andWhere('p.createdAt >= :from', { from: filter.from });
        if (filter === null || filter === void 0 ? void 0 : filter.to)
            qb.andWhere('p.createdAt <= :to', { to: filter.to });
        return qb.getMany();
    }
    async update(id, data) {
        const items = Array.isArray(data === null || data === void 0 ? void 0 : data.items) ? data.items : null;
        const payload = { ...data };
        delete payload.items;
        await this.presRepo.update({ id }, payload);
        if (items) {
            await this.itemRepo.createQueryBuilder().delete().where('"prescriptionId" = :pid', { pid: id }).execute();
            if (items.length) {
                const now = new Date();
                const toSave = items.map((it) => {
                    var _a, _b;
                    return this.itemRepo.create({
                        prescription: { id },
                        name: it.name,
                        dosage: it.dosage,
                        duration: it.duration,
                        quantity: it.quantity,
                        dayDivide: (_a = it.dayDivide) !== null && _a !== void 0 ? _a : null,
                        method: (_b = it.method) !== null && _b !== void 0 ? _b : null,
                        createdAt: now,
                        updatedAt: now,
                    });
                });
                await this.itemRepo.save(toSave);
            }
        }
        return this.findOne(id);
    }
    async dispense(id) {
        return this.presRepo.findOne({ where: { id }, relations: ['items', 'patient', 'patient.user', 'doctor', 'doctor.user'] });
    }
    async findAllForDoctor(doctorId, filter) { return this.findAll({ ...filter, doctorId }); }
    async findAllForPatient(patientId, filter) { return this.findAll({ ...filter, patientId }); }
    async findAllForDispense(filter) { return this.findAll(filter); }
    async isDoctorOwner(prescriptionId, doctorStaffId) {
        var _a;
        const row = await this.presRepo.findOne({ where: { id: prescriptionId }, relations: ['doctor'] });
        return !!row && ((_a = row.doctor) === null || _a === void 0 ? void 0 : _a.id) === doctorStaffId;
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prescription_entity_1.Prescription)),
    __param(1, (0, typeorm_1.InjectRepository)(prescription_item_entity_1.PrescriptionItem)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __param(3, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PrescriptionService);
