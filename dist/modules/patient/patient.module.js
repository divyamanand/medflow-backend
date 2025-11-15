"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const patient_service_1 = require("./patient.service");
const patient_controller_1 = require("./patient.controller");
const patient_entity_1 = require("../../entities/patient.entity");
const appointment_entity_1 = require("../../entities/appointment.entity");
const prescription_entity_1 = require("../../entities/prescription.entity");
const roles_guard_1 = require("../auth/roles.guard");
const patient_or_doctor_guard_1 = require("../auth/patient-or-doctor.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_entity_1 = require("../../entities/user.entity");
let PatientModule = class PatientModule {
};
exports.PatientModule = PatientModule;
exports.PatientModule = PatientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([patient_entity_1.Patient, appointment_entity_1.Appointment, prescription_entity_1.Prescription, user_entity_1.User])],
        controllers: [patient_controller_1.PatientController],
        providers: [patient_service_1.PatientService, roles_guard_1.RolesGuard, patient_or_doctor_guard_1.PatientOrDoctorGuard, jwt_auth_guard_1.JwtAuthGuard],
        exports: [patient_service_1.PatientService]
    })
], PatientModule);
