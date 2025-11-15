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
exports.RequirementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_requirement_entity_1 = require("../../entities/item-requirement.entity");
const item_requirement_fulfillment_entity_1 = require("../../entities/item-requirement-fulfillment.entity");
const staff_requirement_entity_1 = require("../../entities/staff-requirement.entity");
const staff_requirement_fulfillment_entity_1 = require("../../entities/staff-requirement-fulfillment.entity");
const room_requirement_entity_1 = require("../../entities/room-requirement.entity");
const room_requirement_fulfillment_entity_1 = require("../../entities/room-requirement-fulfillment.entity");
let RequirementService = class RequirementService {
    constructor(itemReqRepo, itemFulfillRepo, staffReqRepo, staffFulfillRepo, roomReqRepo, roomFulfillRepo) {
        this.itemReqRepo = itemReqRepo;
        this.itemFulfillRepo = itemFulfillRepo;
        this.staffReqRepo = staffReqRepo;
        this.staffFulfillRepo = staffFulfillRepo;
        this.roomReqRepo = roomReqRepo;
        this.roomFulfillRepo = roomFulfillRepo;
    }
    listItemRequirements() { return this.itemReqRepo.find({ order: { createdAt: 'DESC' } }); }
    async getItemRequirement(id) {
        const r = await this.itemReqRepo.findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Item requirement not found');
        return r;
    }
    createItemRequirement(body) {
        var _a;
        const r = this.itemReqRepo.create({
            primaryUserId: body.primaryUserId,
            kind: body.kind,
            quantity: body.quantity,
            notes: (_a = body.notes) !== null && _a !== void 0 ? _a : null,
            status: item_requirement_entity_1.RequirementStatus.Open,
        });
        return this.itemReqRepo.save(r);
    }
    async updateItemRequirement(id, body) {
        var _a;
        const r = await this.getItemRequirement(id);
        if (typeof body.status !== 'undefined')
            r.status = body.status;
        if (typeof body.notes !== 'undefined')
            r.notes = (_a = body.notes) !== null && _a !== void 0 ? _a : null;
        if (typeof body.quantity !== 'undefined')
            r.quantity = body.quantity;
        return this.itemReqRepo.save(r);
    }
    async listItemFulfillments(requirementId) {
        await this.getItemRequirement(requirementId);
        return this.itemFulfillRepo.find({ where: { requirement: { id: requirementId } }, order: { createdAt: 'ASC' } });
    }
    async createItemFulfillment(requirementId, body) {
        const req = await this.getItemRequirement(requirementId);
        if (req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.itemReqRepo.save(req);
        }
        const f = this.itemFulfillRepo.create({
            requirement: { id: requirementId },
            inventoryItem: { id: body.inventoryItemId },
            quantity: body.quantity,
            startAt: body.startAt ? new Date(body.startAt) : null,
            endAt: body.endAt ? new Date(body.endAt) : null,
        });
        const saved = await this.itemFulfillRepo.save(f);
        await this.recomputeItemRequirementStatus(requirementId);
        return saved;
    }
    async updateItemFulfillment(fulfillmentId, body) {
        const f = await this.itemFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
        if (!f)
            throw new common_1.NotFoundException('Item fulfillment not found');
        if (typeof body.startAt !== 'undefined')
            f.startAt = body.startAt ? new Date(body.startAt) : null;
        if (typeof body.endAt !== 'undefined')
            f.endAt = body.endAt ? new Date(body.endAt) : null;
        if (typeof body.quantity !== 'undefined')
            f.quantity = body.quantity;
        const saved = await this.itemFulfillRepo.save(f);
        await this.recomputeItemRequirementStatus(f.requirement.id);
        return saved;
    }
    async recomputeItemRequirementStatus(requirementId) {
        var _a;
        const req = await this.getItemRequirement(requirementId);
        const raw = await this.itemFulfillRepo.createQueryBuilder('f')
            .select('COALESCE(SUM(f.quantity),0)', 'sum')
            .where('f.requirementId = :id', { id: requirementId })
            .getRawOne();
        const total = parseInt(((_a = raw === null || raw === void 0 ? void 0 : raw.sum) !== null && _a !== void 0 ? _a : '0'), 10);
        if (total >= req.quantity && req.status !== item_requirement_entity_1.RequirementStatus.Fulfilled) {
            req.status = item_requirement_entity_1.RequirementStatus.Fulfilled;
            await this.itemReqRepo.save(req);
        }
        else if (total > 0 && req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.itemReqRepo.save(req);
        }
    }
    listStaffRequirements() { return this.staffReqRepo.find({ order: { createdAt: 'DESC' } }); }
    async getStaffRequirement(id) {
        const r = await this.staffReqRepo.findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Staff requirement not found');
        return r;
    }
    createStaffRequirement(body) {
        var _a;
        const r = this.staffReqRepo.create({
            primaryUserId: body.primaryUserId,
            roleNeeded: body.roleNeeded,
            quantity: body.quantity,
            notes: (_a = body.notes) !== null && _a !== void 0 ? _a : null,
            status: item_requirement_entity_1.RequirementStatus.Open,
        });
        return this.staffReqRepo.save(r);
    }
    async updateStaffRequirement(id, body) {
        var _a;
        const r = await this.getStaffRequirement(id);
        if (typeof body.status !== 'undefined')
            r.status = body.status;
        if (typeof body.notes !== 'undefined')
            r.notes = (_a = body.notes) !== null && _a !== void 0 ? _a : null;
        if (typeof body.quantity !== 'undefined')
            r.quantity = body.quantity;
        if (typeof body.roleNeeded !== 'undefined')
            r.roleNeeded = body.roleNeeded;
        return this.staffReqRepo.save(r);
    }
    async listStaffFulfillments(requirementId) {
        await this.getStaffRequirement(requirementId);
        return this.staffFulfillRepo.find({ where: { requirement: { id: requirementId } }, order: { createdAt: 'ASC' } });
    }
    async createStaffFulfillment(requirementId, body) {
        const req = await this.getStaffRequirement(requirementId);
        if (req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.staffReqRepo.save(req);
        }
        const f = this.staffFulfillRepo.create({
            requirement: { id: requirementId },
            staff: { id: body.staffId },
            startAt: body.startAt ? new Date(body.startAt) : null,
            endAt: body.endAt ? new Date(body.endAt) : null,
        });
        const saved = await this.staffFulfillRepo.save(f);
        await this.recomputeStaffRequirementStatus(requirementId);
        return saved;
    }
    async updateStaffFulfillment(fulfillmentId, body) {
        const f = await this.staffFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
        if (!f)
            throw new common_1.NotFoundException('Staff fulfillment not found');
        if (typeof body.startAt !== 'undefined')
            f.startAt = body.startAt ? new Date(body.startAt) : null;
        if (typeof body.endAt !== 'undefined')
            f.endAt = body.endAt ? new Date(body.endAt) : null;
        const saved = await this.staffFulfillRepo.save(f);
        await this.recomputeStaffRequirementStatus(f.requirement.id);
        return saved;
    }
    async recomputeStaffRequirementStatus(requirementId) {
        const req = await this.getStaffRequirement(requirementId);
        const total = await this.staffFulfillRepo.count({ where: { requirement: { id: requirementId } } });
        if (total >= req.quantity && req.status !== item_requirement_entity_1.RequirementStatus.Fulfilled) {
            req.status = item_requirement_entity_1.RequirementStatus.Fulfilled;
            await this.staffReqRepo.save(req);
        }
        else if (total > 0 && req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.staffReqRepo.save(req);
        }
    }
    listRoomRequirements() { return this.roomReqRepo.find({ order: { createdAt: 'DESC' } }); }
    async getRoomRequirement(id) {
        const r = await this.roomReqRepo.findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Room requirement not found');
        return r;
    }
    createRoomRequirement(body) {
        var _a;
        const r = this.roomReqRepo.create({
            primaryUserId: body.primaryUserId,
            roomType: body.roomType,
            quantity: body.quantity,
            notes: (_a = body.notes) !== null && _a !== void 0 ? _a : null,
            status: item_requirement_entity_1.RequirementStatus.Open,
        });
        return this.roomReqRepo.save(r);
    }
    async updateRoomRequirement(id, body) {
        var _a;
        const r = await this.getRoomRequirement(id);
        if (typeof body.status !== 'undefined')
            r.status = body.status;
        if (typeof body.notes !== 'undefined')
            r.notes = (_a = body.notes) !== null && _a !== void 0 ? _a : null;
        if (typeof body.quantity !== 'undefined')
            r.quantity = body.quantity;
        if (typeof body.roomType !== 'undefined')
            r.roomType = body.roomType;
        return this.roomReqRepo.save(r);
    }
    async listRoomFulfillments(requirementId) {
        await this.getRoomRequirement(requirementId);
        return this.roomFulfillRepo.find({ where: { requirement: { id: requirementId } }, order: { createdAt: 'ASC' } });
    }
    async createRoomFulfillment(requirementId, body) {
        const req = await this.getRoomRequirement(requirementId);
        if (req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.roomReqRepo.save(req);
        }
        const f = this.roomFulfillRepo.create({
            requirement: { id: requirementId },
            room: { id: body.roomId },
            startAt: body.startAt ? new Date(body.startAt) : null,
            endAt: body.endAt ? new Date(body.endAt) : null,
        });
        const saved = await this.roomFulfillRepo.save(f);
        await this.recomputeRoomRequirementStatus(requirementId);
        return saved;
    }
    async updateRoomFulfillment(fulfillmentId, body) {
        const f = await this.roomFulfillRepo.findOne({ where: { id: fulfillmentId }, relations: { requirement: true } });
        if (!f)
            throw new common_1.NotFoundException('Room fulfillment not found');
        if (typeof body.startAt !== 'undefined')
            f.startAt = body.startAt ? new Date(body.startAt) : null;
        if (typeof body.endAt !== 'undefined')
            f.endAt = body.endAt ? new Date(body.endAt) : null;
        const saved = await this.roomFulfillRepo.save(f);
        await this.recomputeRoomRequirementStatus(f.requirement.id);
        return saved;
    }
    async recomputeRoomRequirementStatus(requirementId) {
        const req = await this.getRoomRequirement(requirementId);
        const total = await this.roomFulfillRepo.count({ where: { requirement: { id: requirementId } } });
        if (total >= req.quantity && req.status !== item_requirement_entity_1.RequirementStatus.Fulfilled) {
            req.status = item_requirement_entity_1.RequirementStatus.Fulfilled;
            await this.roomReqRepo.save(req);
        }
        else if (total > 0 && req.status === item_requirement_entity_1.RequirementStatus.Open) {
            req.status = item_requirement_entity_1.RequirementStatus.InProgress;
            await this.roomReqRepo.save(req);
        }
    }
};
exports.RequirementService = RequirementService;
exports.RequirementService = RequirementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_requirement_entity_1.ItemRequirement)),
    __param(1, (0, typeorm_1.InjectRepository)(item_requirement_fulfillment_entity_1.ItemRequirementFulfillment)),
    __param(2, (0, typeorm_1.InjectRepository)(staff_requirement_entity_1.StaffRequirement)),
    __param(3, (0, typeorm_1.InjectRepository)(staff_requirement_fulfillment_entity_1.StaffRequirementFulfillment)),
    __param(4, (0, typeorm_1.InjectRepository)(room_requirement_entity_1.RoomRequirement)),
    __param(5, (0, typeorm_1.InjectRepository)(room_requirement_fulfillment_entity_1.RoomRequirementFulfillment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RequirementService);
