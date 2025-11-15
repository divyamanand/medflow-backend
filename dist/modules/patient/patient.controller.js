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
exports.PatientController = void 0;
const common_1 = require("@nestjs/common");
const patient_service_1 = require("./patient.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let PatientController = class PatientController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q) {
        const filter = {};
        if (q === null || q === void 0 ? void 0 : q.gender)
            filter.gender = q.gender;
        if (q === null || q === void 0 ? void 0 : q.minAge)
            filter.minAge = parseInt(q.minAge, 10);
        if (q === null || q === void 0 ? void 0 : q.maxAge)
            filter.maxAge = parseInt(q.maxAge, 10);
        return this.svc.findAllSummaries(filter);
    }
    async get(id, req) {
        var _a, _b, _c;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.findOne(id);
        if (role === 'patient' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.patientId) === id)
            return this.svc.findOne(id);
        if (role === 'doctor' && await this.svc.isDoctorLinkedToPatient((_c = req.user) === null || _c === void 0 ? void 0 : _c.staffId, id))
            return this.svc.findOne(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    create(body) { return this.svc.create(body); }
    async update(id, body, req) {
        var _a, _b;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.update(id, body);
        if (role === 'patient' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.patientId) === id) {
            const limited = {};
            if (body.phone)
                limited.phone = body.phone;
            if (body.insurance)
                limited.insurance = body.insurance;
            return this.svc.update(id, limited);
        }
        throw new common_1.ForbiddenException('Not allowed');
    }
    async doctorsFromPrescription(id, req) {
        var _a, _b, _c;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.getDoctorsFromPrescriptions(id);
        if (role === 'patient' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.patientId) === id)
            return this.svc.getDoctorsFromPrescriptions(id);
        if (role === 'doctor' && await this.svc.isDoctorLinkedToPatient((_c = req.user) === null || _c === void 0 ? void 0 : _c.staffId, id))
            return this.svc.getDoctorsFromPrescriptions(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    async appointments(id, req) {
        var _a, _b, _c;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.getAppointmentsForPatient(id);
        if (role === 'patient' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.patientId) === id)
            return this.svc.getAppointmentsForPatient(id);
        if (role === 'doctor' && await this.svc.isDoctorLinkedToPatient((_c = req.user) === null || _c === void 0 ? void 0 : _c.staffId, id))
            return this.svc.getAppointmentsForPatient(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
    async prescriptions(id, req) {
        var _a, _b, _c;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === 'admin' || role === 'receptionist')
            return this.svc.getPrescriptionsForPatient(id);
        if (role === 'patient' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.patientId) === id)
            return this.svc.getPrescriptionsForPatient(id);
        if (role === 'doctor' && await this.svc.isDoctorLinkedToPatient((_c = req.user) === null || _c === void 0 ? void 0 : _c.staffId, id))
            return this.svc.getPrescriptionsForPatient(id);
        throw new common_1.ForbiddenException('Not allowed');
    }
};
exports.PatientController = PatientController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/doctors-from-prescription'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "doctorsFromPrescription", null);
__decorate([
    (0, common_1.Get)(':id/appointments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "appointments", null);
__decorate([
    (0, common_1.Get)(':id/prescriptions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'receptionist', 'doctor', 'patient'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "prescriptions", null);
exports.PatientController = PatientController = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [patient_service_1.PatientService])
], PatientController);
