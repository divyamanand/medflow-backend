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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("./staff.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let StaffController = class StaffController {
    constructor(svc) {
        this.svc = svc;
    }
    list(req, q) {
        var _a;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const filter = {};
        if (q === null || q === void 0 ? void 0 : q.role)
            filter.role = q.role;
        if (q === null || q === void 0 ? void 0 : q.specialtyId)
            filter.specialtyId = q.specialtyId;
        if (q === null || q === void 0 ? void 0 : q.isAvailable)
            filter.isAvailable = q.isAvailable === 'true';
        if (q === null || q === void 0 ? void 0 : q.onLeave)
            filter.onLeave = q.onLeave === 'true';
        return this.svc.findAllDetailed(filter).then(rows => {
            if (role === 'receptionist')
                return rows.filter(r => r.role !== 'admin');
            return rows;
        });
    }
    timingsTable(q) {
        const filter = {};
        if (q.role)
            filter.role = q.role;
        if (q.specialtyId)
            filter.specialtyId = q.specialtyId;
        if (typeof q.weekday !== 'undefined')
            filter.weekday = parseInt(q.weekday, 10);
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        return this.svc.getTimingsTable(filter);
    }
    leavesTable(q) {
        const filter = {};
        if (q.role)
            filter.role = q.role;
        if (q.specialtyId)
            filter.specialtyId = q.specialtyId;
        if (q.status)
            filter.status = q.status;
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        return this.svc.getLeavesTable(filter);
    }
    get(id, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const userStaffId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.staffId;
        if (role === 'admin')
            return this.svc.findOneDetailed(id);
        if (role === 'receptionist') {
            return this.svc.findOneDetailed(id).then(s => { if (!s || s.role === 'admin')
                throw new common_1.ForbiddenException('Not allowed'); return s; });
        }
        if (['doctor', 'inventory', 'pharmacist', 'room_manager'].includes(role) && userStaffId === id)
            return this.svc.findOneDetailed(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    create(body) { return this.svc.create(body); }
    update(id, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const userStaffId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.staffId;
        if (role === 'admin')
            return this.svc.update(id, body);
        if (role === 'receptionist')
            return this.svc.update(id, body);
        if (['doctor', 'inventory', 'pharmacist', 'room_manager'].includes(role) && userStaffId === id) {
            const limited = {};
            if (body.phone)
                limited.phone = body.phone;
            if (body.notes)
                limited.notes = body.notes;
            return this.svc.update(id, limited);
        }
        throw new common_1.ForbiddenException('Not allowed');
    }
    getTimings(id, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.getTimings(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    upsertTimings(id, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.upsertTimings(id, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    createTiming(id, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.createTiming(id, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    getTiming(id, timingId, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.getTimingById(id, timingId);
        throw new common_1.ForbiddenException('Not allowed');
    }
    updateTiming(id, timingId, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.updateTiming(id, timingId, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    deleteTiming(id, timingId, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.deleteTiming(id, timingId);
        throw new common_1.ForbiddenException('Not allowed');
    }
    listLeaves(id, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.listLeaves(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    addLeave(id, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.addLeave(id, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    getLeave(id, leaveId, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.getLeaveById(id, leaveId);
        throw new common_1.ForbiddenException('Not allowed');
    }
    updateLeave(id, leaveId, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.updateLeave(id, leaveId, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    deleteLeave(id, leaveId, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'admin' || role === 'receptionist' || sub === id)
            return this.svc.deleteLeave(id, leaveId);
        throw new common_1.ForbiddenException('Not allowed');
    }
    listSpecialties(id) {
        return this.svc.getSpecialties(id);
    }
    addSpecialty(id, body) {
        return this.svc.addSpecialty(id, body.specialtyId, body.primary || false);
    }
    removeSpecialty(id, specialtyId) {
        return this.svc.removeSpecialty(id, specialtyId);
    }
    remove(id, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const userStaffId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.staffId;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.softDelete(id);
        if (['doctor', 'inventory', 'pharmacist', 'room_manager'].includes(role) && userStaffId === id)
            return this.svc.softDelete(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('timings'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "timingsTable", null);
__decorate([
    (0, common_1.Get)('leaves'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "leavesTable", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/timings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "getTimings", null);
__decorate([
    (0, common_1.Post)(':id/timings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "upsertTimings", null);
__decorate([
    (0, common_1.Post)(':id/timings/single'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "createTiming", null);
__decorate([
    (0, common_1.Get)(':id/timings/:timingId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('timingId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "getTiming", null);
__decorate([
    (0, common_1.Put)(':id/timings/:timingId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('timingId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "updateTiming", null);
__decorate([
    (0, common_1.Delete)(':id/timings/:timingId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('timingId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "deleteTiming", null);
__decorate([
    (0, common_1.Get)(':id/leaves'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "listLeaves", null);
__decorate([
    (0, common_1.Post)(':id/leaves'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "addLeave", null);
__decorate([
    (0, common_1.Get)(':id/leaves/:leaveId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('leaveId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "getLeave", null);
__decorate([
    (0, common_1.Put)(':id/leaves/:leaveId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('leaveId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "updateLeave", null);
__decorate([
    (0, common_1.Delete)(':id/leaves/:leaveId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('leaveId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "deleteLeave", null);
__decorate([
    (0, common_1.Get)(':id/specialties'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "listSpecialties", null);
__decorate([
    (0, common_1.Post)(':id/specialties'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "addSpecialty", null);
__decorate([
    (0, common_1.Delete)(':id/specialties/:specialtyId'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('specialtyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "removeSpecialty", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StaffController.prototype, "remove", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
