"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointment_service_1 = require("./appointment.service");
const appointment_controller_1 = require("./appointment.controller");
const appointment_entity_1 = require("../../entities/appointment.entity");
const roles_guard_1 = require("../auth/roles.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const staff_entity_1 = require("../../entities/staff.entity");
const timings_entity_1 = require("../../entities/timings.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const specialty_entity_1 = require("../../entities/specialty.entity");
const llm_module_1 = require("../llm/llm.module");
let AppointmentModule = class AppointmentModule {
};
exports.AppointmentModule = AppointmentModule;
exports.AppointmentModule = AppointmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([appointment_entity_1.Appointment, staff_entity_1.Staff, timings_entity_1.Timings, leave_entity_1.Leave, specialty_entity_1.Specialty]), llm_module_1.LlmModule],
        controllers: [appointment_controller_1.AppointmentController],
        providers: [appointment_service_1.AppointmentService, roles_guard_1.RolesGuard, jwt_auth_guard_1.JwtAuthGuard],
        exports: [appointment_service_1.AppointmentService]
    })
], AppointmentModule);
