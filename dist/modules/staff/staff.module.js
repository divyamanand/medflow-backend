"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_service_1 = require("./staff.service");
const staff_controller_1 = require("./staff.controller");
const staff_entity_1 = require("../../entities/staff.entity");
const timings_entity_1 = require("../../entities/timings.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const user_entity_1 = require("../../entities/user.entity");
const staff_requirement_entity_1 = require("../../entities/staff-requirement.entity");
const staff_requirement_fulfillment_entity_1 = require("../../entities/staff-requirement-fulfillment.entity");
let StaffModule = class StaffModule {
};
exports.StaffModule = StaffModule;
exports.StaffModule = StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([staff_entity_1.Staff, timings_entity_1.Timings, leave_entity_1.Leave, user_entity_1.User, staff_requirement_entity_1.StaffRequirement, staff_requirement_fulfillment_entity_1.StaffRequirementFulfillment])],
        controllers: [staff_controller_1.StaffController],
        providers: [staff_service_1.StaffService],
        exports: [staff_service_1.StaffService]
    })
], StaffModule);
