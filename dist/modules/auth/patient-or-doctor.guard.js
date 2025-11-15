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
exports.PatientOrDoctorGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../../entities/patient.entity");
const appointment_entity_1 = require("../../entities/appointment.entity");
let PatientOrDoctorGuard = class PatientOrDoctorGuard {
    constructor(patientRepo, apptRepo) {
        this.patientRepo = patientRepo;
        this.apptRepo = apptRepo;
    }
    async canActivate(context) {
        var _a, _b;
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user)
            throw new common_1.ForbiddenException('Unauthorized');
        const patientId = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.params) === null || _b === void 0 ? void 0 : _b.patientId);
        if (!patientId)
            return true;
        if (user.role === 'admin' || user.role === 'receptionist')
            return true;
        if (user.role === 'patient') {
            if (user.id === patientId)
                return true;
            throw new common_1.ForbiddenException('Patients can only access their data');
        }
        if (user.role === 'doctor') {
            const patient = await this.patientRepo.findOne({ where: { id: patientId }, relations: ['primaryPhysician'] });
            if ((patient === null || patient === void 0 ? void 0 : patient.primaryPhysician) && patient.primaryPhysician.id === user.id)
                return true;
            const busy = [
                appointment_entity_1.AppointmentStatus.Pending,
                appointment_entity_1.AppointmentStatus.Confirmed,
                appointment_entity_1.AppointmentStatus.CheckedIn,
                appointment_entity_1.AppointmentStatus.InProgress,
                appointment_entity_1.AppointmentStatus.Completed,
            ];
            const count = await this.apptRepo.createQueryBuilder('a')
                .where('a.patient_id = :pid', { pid: patientId })
                .andWhere('a.doctor_id = :did', { did: user.id })
                .andWhere('a.status IN (:...st)', { st: busy })
                .getCount();
            if (count > 0)
                return true;
            throw new common_1.ForbiddenException('Doctor not assigned to this patient');
        }
        throw new common_1.ForbiddenException('Insufficient role');
    }
};
exports.PatientOrDoctorGuard = PatientOrDoctorGuard;
exports.PatientOrDoctorGuard = PatientOrDoctorGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PatientOrDoctorGuard);
