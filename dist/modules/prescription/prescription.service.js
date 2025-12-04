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
let PrescriptionService = class PrescriptionService {
    constructor(presRepo, itemRepo) {
        this.presRepo = presRepo;
        this.itemRepo = itemRepo;
    }
    async findAll(filter) {
        const qb = this.presRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.patient', 'patient')
            .leftJoinAndSelect('patient.user', 'pUser')
            .leftJoinAndSelect('p.doctor', 'doctor')
            .leftJoinAndSelect('doctor.user', 'dUser')
            .leftJoinAndSelect('p.items', 'items')
            .where('1=1');
        if (filter === null || filter === void 0 ? void 0 : filter.patientId)
            qb.andWhere('p."patientId" = :pid', { pid: filter.patientId });
        if (filter === null || filter === void 0 ? void 0 : filter.doctorId)
            qb.andWhere('p."doctorId" = :did', { did: filter.doctorId });
        if (filter === null || filter === void 0 ? void 0 : filter.from)
            qb.andWhere('p."createdAt" >= :from', { from: filter.from });
        if (filter === null || filter === void 0 ? void 0 : filter.to)
            qb.andWhere('p."createdAt" <= :to', { to: filter.to });
        qb.orderBy('p."createdAt"', 'DESC');
        return qb.getMany();
    }
    async create(data) {
        const items = data.items || [];
        delete data.items;
        const prescription = this.presRepo.create({
            patient: { id: data.patientId },
            doctor: data.doctorId ? { id: data.doctorId } : null,
            nextReview: data.nextReview || null,
            diagnosis: data.diagnosis || null,
            notes: data.notes || null,
            updatedAt: new Date(),
        });
        const savedPrescription = await this.presRepo.save(prescription);
        if (items.length > 0) {
            const now = new Date();
            const itemEntities = items.map(item => this.itemRepo.create({
                prescription: { id: savedPrescription.id },
                name: item.name,
                dosage: item.dosage,
                duration: item.duration,
                quantity: item.quantity,
                dayDivide: item.dayDivide || null,
                method: item.method || null,
                createdAt: now,
                updatedAt: now,
            }));
            await this.itemRepo.save(itemEntities);
        }
        return this.findOne(savedPrescription.id);
    }
    async findOne(id) {
        const prescription = await this.presRepo.findOne({
            where: { id },
            relations: ['patient', 'patient.user', 'doctor', 'doctor.user', 'items'],
        });
        return prescription;
    }
    async update(id, data) {
        const prescription = await this.presRepo.findOne({ where: { id } });
        if (!prescription) {
            throw new common_1.NotFoundException(`Prescription with id '${id}' not found`);
        }
        const items = data.items;
        delete data.items;
        const updateData = { ...data, updatedAt: new Date() };
        await this.presRepo.update({ id }, updateData);
        if (items !== undefined) {
            await this.itemRepo.delete({ prescription: { id } });
            if (items.length > 0) {
                const now = new Date();
                const itemEntities = items.map(item => this.itemRepo.create({
                    prescription: { id },
                    name: item.name,
                    dosage: item.dosage,
                    duration: item.duration,
                    quantity: item.quantity,
                    dayDivide: item.dayDivide || null,
                    method: item.method || null,
                    createdAt: now,
                    updatedAt: now,
                }));
                await this.itemRepo.save(itemEntities);
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        const prescription = await this.presRepo.findOne({ where: { id } });
        if (!prescription) {
            throw new common_1.NotFoundException(`Prescription with id '${id}' not found`);
        }
        await this.presRepo.delete({ id });
        return { id, removed: true };
    }
    async addItem(prescriptionId, data) {
        const prescription = await this.presRepo.findOne({ where: { id: prescriptionId } });
        if (!prescription) {
            throw new common_1.NotFoundException(`Prescription with id '${prescriptionId}' not found`);
        }
        const now = new Date();
        const item = this.itemRepo.create({
            prescription: { id: prescriptionId },
            name: data.name,
            dosage: data.dosage,
            duration: data.duration,
            quantity: data.quantity,
            dayDivide: data.dayDivide || null,
            method: data.method || null,
            createdAt: now,
            updatedAt: now,
        });
        return this.itemRepo.save(item);
    }
    async updateItem(itemId, data) {
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException(`Prescription item with id '${itemId}' not found`);
        }
        const updateData = { ...data, updatedAt: new Date() };
        await this.itemRepo.update({ id: itemId }, updateData);
        return this.itemRepo.findOne({ where: { id: itemId } });
    }
    async removeItem(itemId) {
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException(`Prescription item with id '${itemId}' not found`);
        }
        await this.itemRepo.delete({ id: itemId });
        return { id: itemId, removed: true };
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prescription_entity_1.Prescription)),
    __param(1, (0, typeorm_1.InjectRepository)(prescription_item_entity_1.PrescriptionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PrescriptionService);
