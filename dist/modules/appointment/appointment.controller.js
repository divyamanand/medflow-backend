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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const appointment_service_1 = require("./appointment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AppointmentController = class AppointmentController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const filter = {};
        if (q === null || q === void 0 ? void 0 : q.status)
            filter.status = q.status;
        if (q === null || q === void 0 ? void 0 : q.doctorId)
            filter.doctorId = q.doctorId;
        if (q === null || q === void 0 ? void 0 : q.patientId)
            filter.patientId = q.patientId;
        if (q === null || q === void 0 ? void 0 : q.from)
            filter.from = q.from;
        if (q === null || q === void 0 ? void 0 : q.to)
            filter.to = q.to;
        if (q === null || q === void 0 ? void 0 : q.timeframe) {
            const tf = q.timeframe;
            const now = new Date();
            let start = null;
            let end = null;
            if (tf === 'day') {
                start = new Date(now);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 1);
            }
            else if (tf === 'month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
            }
            else if (tf === 'year') {
                start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
            }
            if (start && end) {
                filter.from = start.toISOString();
                filter.to = end.toISOString();
            }
        }
        if ((q === null || q === void 0 ? void 0 : q.rangeStart) && (q === null || q === void 0 ? void 0 : q.rangeEnd)) {
            filter.from = new Date(q.rangeStart).toISOString();
            filter.to = new Date(q.rangeEnd).toISOString();
        }
        if (role === 'patient')
            filter.patientId = sub;
        if (role === 'doctor')
            filter.doctorId = sub;
        return this.svc.findAll(filter).then(rows => rows.map(r => {
            var _a, _b, _c, _d;
            const patientId = ((_a = r.patient) === null || _a === void 0 ? void 0 : _a.id) || null;
            const doctorId = ((_b = r.doctor) === null || _b === void 0 ? void 0 : _b.id) || null;
            const pUser = ((_c = r.patient) === null || _c === void 0 ? void 0 : _c.user) || null;
            const dUser = ((_d = r.doctor) === null || _d === void 0 ? void 0 : _d.user) || null;
            const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
            const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
            return {
                id: r.id,
                patientId,
                doctorId,
                patientName,
                doctorName,
                startAt: r.startAt,
                endAt: r.endAt,
                status: r.status,
                issues: r.issues,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            };
        }));
    }
    listByPatient(patientId, q, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'patient' && patientId !== sub) {
            throw new common_1.ForbiddenException('Patients can only view their own appointments');
        }
        const filter = { patientId };
        if (q === null || q === void 0 ? void 0 : q.status)
            filter.status = q.status;
        if (q === null || q === void 0 ? void 0 : q.doctorId)
            filter.doctorId = q.doctorId;
        if (q === null || q === void 0 ? void 0 : q.from)
            filter.from = q.from;
        if (q === null || q === void 0 ? void 0 : q.to)
            filter.to = q.to;
        if (q === null || q === void 0 ? void 0 : q.timeframe) {
            const tf = q.timeframe;
            const now = new Date();
            let start = null;
            let end = null;
            if (tf === 'day') {
                start = new Date(now);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 1);
            }
            else if (tf === 'month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
            }
            else if (tf === 'year') {
                start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
            }
            if (start && end) {
                filter.from = start.toISOString();
                filter.to = end.toISOString();
            }
        }
        if ((q === null || q === void 0 ? void 0 : q.rangeStart) && (q === null || q === void 0 ? void 0 : q.rangeEnd)) {
            filter.from = new Date(q.rangeStart).toISOString();
            filter.to = new Date(q.rangeEnd).toISOString();
        }
        return this.svc.findAll(filter).then(rows => rows.map(r => {
            var _a, _b, _c, _d;
            const patientId = ((_a = r.patient) === null || _a === void 0 ? void 0 : _a.id) || null;
            const doctorId = ((_b = r.doctor) === null || _b === void 0 ? void 0 : _b.id) || null;
            const pUser = ((_c = r.patient) === null || _c === void 0 ? void 0 : _c.user) || null;
            const dUser = ((_d = r.doctor) === null || _d === void 0 ? void 0 : _d.user) || null;
            const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
            const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
            return {
                id: r.id,
                patientId,
                doctorId,
                patientName,
                doctorName,
                startAt: r.startAt,
                endAt: r.endAt,
                status: r.status,
                issues: r.issues,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            };
        }));
    }
    listByDoctor(doctorId, q, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (role === 'doctor' && doctorId !== sub) {
            throw new common_1.ForbiddenException('Doctors can only view their own appointments');
        }
        const filter = { doctorId };
        if (q === null || q === void 0 ? void 0 : q.status)
            filter.status = q.status;
        if (q === null || q === void 0 ? void 0 : q.patientId)
            filter.patientId = q.patientId;
        if (q === null || q === void 0 ? void 0 : q.from)
            filter.from = q.from;
        if (q === null || q === void 0 ? void 0 : q.to)
            filter.to = q.to;
        if (q === null || q === void 0 ? void 0 : q.timeframe) {
            const tf = q.timeframe;
            const now = new Date();
            let start = null;
            let end = null;
            if (tf === 'day') {
                start = new Date(now);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 1);
            }
            else if (tf === 'month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
            }
            else if (tf === 'year') {
                start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
            }
            if (start && end) {
                filter.from = start.toISOString();
                filter.to = end.toISOString();
            }
        }
        if ((q === null || q === void 0 ? void 0 : q.rangeStart) && (q === null || q === void 0 ? void 0 : q.rangeEnd)) {
            filter.from = new Date(q.rangeStart).toISOString();
            filter.to = new Date(q.rangeEnd).toISOString();
        }
        return this.svc.findAll(filter).then(rows => rows.map(r => {
            var _a, _b, _c, _d;
            const patientId = ((_a = r.patient) === null || _a === void 0 ? void 0 : _a.id) || null;
            const doctorId = ((_b = r.doctor) === null || _b === void 0 ? void 0 : _b.id) || null;
            const pUser = ((_c = r.patient) === null || _c === void 0 ? void 0 : _c.user) || null;
            const dUser = ((_d = r.doctor) === null || _d === void 0 ? void 0 : _d.user) || null;
            const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
            const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
            return {
                id: r.id,
                patientId,
                doctorId,
                patientName,
                doctorName,
                startAt: r.startAt,
                endAt: r.endAt,
                status: r.status,
                issues: r.issues,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            };
        }));
    }
    async get(id, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const r = await this.svc.findOne(id);
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!r)
            return r;
        if (role === 'admin' || role === 'receptionist' || (role === 'patient' && ((_c = r.patient) === null || _c === void 0 ? void 0 : _c.id) === sub) || (role === 'doctor' && ((_d = r.doctor) === null || _d === void 0 ? void 0 : _d.id) === sub)) {
            const patientId = ((_e = r.patient) === null || _e === void 0 ? void 0 : _e.id) || null;
            const doctorId = ((_f = r.doctor) === null || _f === void 0 ? void 0 : _f.id) || null;
            const pUser = ((_g = r.patient) === null || _g === void 0 ? void 0 : _g.user) || null;
            const dUser = ((_h = r.doctor) === null || _h === void 0 ? void 0 : _h.user) || null;
            const patientName = pUser ? [pUser.firstName || '', pUser.lastName || ''].join(' ').trim() || null : null;
            const doctorName = dUser ? [dUser.firstName || '', dUser.lastName || ''].join(' ').trim() || null : null;
            return {
                id: r.id,
                patientId,
                doctorId,
                patientName,
                doctorName,
                startAt: r.startAt,
                endAt: r.endAt,
                status: r.status,
                issues: r.issues,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            };
        }
        throw new common_1.ForbiddenException('Not allowed');
    }
    createOrBook(body, req) {
        var _a, _b, _c, _d;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const patientIdInput = body.patientId || body.patient_id || ((_c = body.patient) === null || _c === void 0 ? void 0 : _c.id);
        const doctorIdInput = body.doctorId || body.doctor_id || ((_d = body.doctor) === null || _d === void 0 ? void 0 : _d.id);
        const startAt = body.startAt;
        const endAt = body.endAt;
        const issues = Array.isArray(body.issues) ? body.issues : undefined;
        if (role === 'patient' && patientIdInput && patientIdInput !== sub)
            throw new common_1.ForbiddenException('Patients can only book for self');
        if (role === 'doctor' && doctorIdInput && doctorIdInput !== sub)
            throw new common_1.ForbiddenException('Doctors can only book their own slots');
        const patientId = role === 'patient' ? sub : patientIdInput;
        const doctorId = role === 'doctor' ? sub : doctorIdInput;
        if (!patientId)
            throw new common_1.ForbiddenException('patientId required');
        if (!doctorId)
            throw new common_1.ForbiddenException('doctorId required');
        if (!startAt || !endAt)
            throw new common_1.ForbiddenException('startAt and endAt required');
        return this.svc.book({ patient: { id: patientId }, doctor: { id: doctorId }, startAt, endAt, issues });
    }
    findMatchingDoctors(body) {
        return this.svc.findMatchingDoctorsForIssues(body);
    }
    nextSlots(doctorId, date, req) {
        return this.svc.getDoctorNext3Slots(doctorId, date);
    }
    async update(id, body, req) {
        var _a, _b, _c, _d;
        const appt = await this.svc.findOne(id);
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!appt)
            return appt;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.update(id, body);
        if (role === 'patient' && ((_c = appt.patient) === null || _c === void 0 ? void 0 : _c.id) === sub)
            return this.svc.update(id, body);
        if (role === 'doctor' && ((_d = appt.doctor) === null || _d === void 0 ? void 0 : _d.id) === sub)
            return this.svc.update(id, body);
        throw new common_1.ForbiddenException('Not allowed');
    }
    async cancelWithReason(id, body, req) {
        var _a, _b, _c;
        const appt = await this.svc.findOne(id);
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!appt)
            return appt;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.cancel(id, body === null || body === void 0 ? void 0 : body.reason);
        if (role === 'patient' && ((_c = appt.patient) === null || _c === void 0 ? void 0 : _c.id) === sub)
            return this.svc.cancel(id, body === null || body === void 0 ? void 0 : body.reason);
        throw new common_1.ForbiddenException('Not allowed');
    }
    async cancel(id, req) {
        var _a, _b, _c, _d;
        const appt = await this.svc.findOne(id);
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const sub = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!appt)
            return appt;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.cancel(id);
        if (role === 'patient' && ((_c = appt.patient) === null || _c === void 0 ? void 0 : _c.id) === sub)
            return this.svc.cancel(id);
        if (role === 'doctor' && ((_d = appt.doctor) === null || _d === void 0 ? void 0 : _d.id) === sub)
            return this.svc.cancel(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    patch(id, body, req) { return this.svc.update(id, body); }
    hardDelete(id) { return this.svc.remove(id); }
    confirm(id, req) { return this.svc.transition(id, 'confirm'); }
    checkin(id, req) { return this.svc.transition(id, 'checkin'); }
    complete(id, req) { return this.svc.transition(id, 'complete'); }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "listByPatient", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "listByDoctor", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "createOrBook", null);
__decorate([
    (0, common_1.Post)('findMatchingDoctorsForIssues'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "findMatchingDoctors", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/next3Slots'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "nextSlots", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancelWithReason", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "cancel", null);
__decorate([
    (0, common_1.Put)(':id/patch'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/checkin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "checkin", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "complete", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
