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
exports.PrescriptionController = void 0;
const common_1 = require("@nestjs/common");
const prescription_service_1 = require("./prescription.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PrescriptionController = class PrescriptionController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q, req) {
        const filter = {};
        if (q.patientId)
            filter.patientId = q.patientId;
        if (q.doctorId)
            filter.doctorId = q.doctorId;
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        if (req.user.role === 'patient') {
            filter.patientId = req.user.patientId;
        }
        return this.svc.findAll(filter);
    }
    create(body, req) {
        if (req.user.role === 'doctor') {
            body.doctorId = req.user.staffId;
        }
        return this.svc.create(body);
    }
    async getOne(id, req) {
        var _a;
        const prescription = await this.svc.findOne(id);
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        if (req.user.role === 'patient') {
            if (((_a = prescription.patient) === null || _a === void 0 ? void 0 : _a.id) !== req.user.patientId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return prescription;
    }
    async update(id, body, req) {
        var _a;
        if (req.user.role === 'doctor') {
            const existing = await this.svc.findOne(id);
            if (!existing)
                throw new common_1.NotFoundException('Prescription not found');
            if (((_a = existing.doctor) === null || _a === void 0 ? void 0 : _a.id) !== req.user.staffId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return this.svc.update(id, body);
    }
    async remove(id, req) {
        var _a;
        if (req.user.role === 'doctor') {
            const existing = await this.svc.findOne(id);
            if (!existing)
                throw new common_1.NotFoundException('Prescription not found');
            if (((_a = existing.doctor) === null || _a === void 0 ? void 0 : _a.id) !== req.user.staffId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return this.svc.remove(id);
    }
    async addItem(prescriptionId, body, req) {
        var _a;
        if (req.user.role === 'doctor') {
            const existing = await this.svc.findOne(prescriptionId);
            if (!existing)
                throw new common_1.NotFoundException('Prescription not found');
            if (((_a = existing.doctor) === null || _a === void 0 ? void 0 : _a.id) !== req.user.staffId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return this.svc.addItem(prescriptionId, body);
    }
    async updateItem(prescriptionId, itemId, body, req) {
        var _a;
        if (req.user.role === 'doctor') {
            const existing = await this.svc.findOne(prescriptionId);
            if (!existing)
                throw new common_1.NotFoundException('Prescription not found');
            if (((_a = existing.doctor) === null || _a === void 0 ? void 0 : _a.id) !== req.user.staffId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return this.svc.updateItem(itemId, body);
    }
    async removeItem(prescriptionId, itemId, req) {
        var _a;
        if (req.user.role === 'doctor') {
            const existing = await this.svc.findOne(prescriptionId);
            if (!existing)
                throw new common_1.NotFoundException('Prescription not found');
            if (((_a = existing.doctor) === null || _a === void 0 ? void 0 : _a.id) !== req.user.staffId) {
                throw new common_1.ForbiddenException('Not allowed');
            }
        }
        return this.svc.removeItem(itemId);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'doctor', 'pharmacist', 'patient'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'doctor', 'pharmacist', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':prescriptionId/items'),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)(':prescriptionId/items/:itemId'),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':prescriptionId/items/:itemId'),
    (0, roles_decorator_1.Roles)('admin', 'doctor'),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "removeItem", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, common_1.Controller)('prescriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService])
], PrescriptionController);
