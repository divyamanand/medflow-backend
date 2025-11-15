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
    create(body, req) {
        if (req.user.role === 'doctor')
            return this.svc.createForDoctor(body, req.user.staffId);
        return this.svc.create(body);
    }
    list(q, req) {
        const role = req.user.role;
        const filter = {};
        if (q.patient_id || q.patientId)
            filter.patientId = q.patient_id || q.patientId;
        if (q.doctor_id || q.doctorId)
            filter.doctorId = q.doctor_id || q.doctorId;
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        const mapBasic = (rows) => rows.map(r => {
            var _a, _b;
            const pUser = ((_a = r.patient) === null || _a === void 0 ? void 0 : _a.user) || null;
            const dUser = ((_b = r.doctor) === null || _b === void 0 ? void 0 : _b.user) || null;
            const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
            const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
            return {
                id: r.id,
                patientName,
                doctorName,
                date: r.createdAt,
                diagnosis: r.diagnosis || null,
            };
        });
        if (role === 'admin')
            return this.svc.findAll(filter).then(mapBasic);
        if (role === 'doctor')
            return this.svc.findAllForDoctor(req.user.staffId, filter).then(mapBasic);
        if (role === 'inventory' || role === 'pharmacist')
            return this.svc.findAllForDispense(filter).then(mapBasic);
        if (role === 'patient')
            return this.svc.findAllForPatient(req.user.patientId, filter).then(mapBasic);
        throw new common_1.ForbiddenException();
    }
    async getOne(id, req) {
        var _a, _b, _c, _d, _e, _f;
        const role = req.user.role;
        const row = await this.svc.findOne(id);
        if (!row)
            throw new common_1.NotFoundException();
        const allow = (role === 'admin' || role === 'inventory' || role === 'pharmacist' ||
            (role === 'doctor' && ((_a = row === null || row === void 0 ? void 0 : row.doctor) === null || _a === void 0 ? void 0 : _a.id) === req.user.staffId) ||
            (role === 'patient' && ((_b = row === null || row === void 0 ? void 0 : row.patient) === null || _b === void 0 ? void 0 : _b.id) === req.user.patientId));
        if (!allow)
            throw new common_1.ForbiddenException();
        const pUser = ((_c = row.patient) === null || _c === void 0 ? void 0 : _c.user) || null;
        const dUser = ((_d = row.doctor) === null || _d === void 0 ? void 0 : _d.user) || null;
        const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
        const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
        return {
            id: row.id,
            patientId: ((_e = row.patient) === null || _e === void 0 ? void 0 : _e.id) || null,
            doctorId: ((_f = row.doctor) === null || _f === void 0 ? void 0 : _f.id) || null,
            patientName,
            doctorName,
            diagnosis: row.diagnosis || null,
            notes: row.notes || null,
            items: Array.isArray(row.items) ? row.items.map((it) => ({
                id: it.id,
                name: it.name,
                dosage: it.dosage,
                duration: it.duration,
                quantity: it.quantity,
                dayDivide: it.dayDivide,
                method: it.method,
            })) : [],
            date: row.createdAt,
            nextReview: row.nextReview || null,
        };
    }
    update(id, body, req) {
        if (req.user.role === 'doctor' && !this.svc.isDoctorOwner(id, req.user.staffId))
            throw new common_1.ForbiddenException();
        return this.svc.update(id, body);
    }
    dispense(id) { return this.svc.dispense(id); }
};
exports.PrescriptionController = PrescriptionController;
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
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'doctor', 'inventory', 'pharmacist', 'patient'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'doctor', 'inventory', 'pharmacist', 'patient'),
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
    __metadata("design:returntype", void 0)
], PrescriptionController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/dispense'),
    (0, roles_decorator_1.Roles)('admin', 'inventory', 'pharmacist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrescriptionController.prototype, "dispense", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, common_1.Controller)('prescriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService])
], PrescriptionController);
