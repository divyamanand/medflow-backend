"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointment_entity_1 = require("../../entities/appointment.entity");
const invitation_entity_1 = require("../../entities/invitation.entity");
const inventory_item_entity_1 = require("../../entities/inventory-item.entity");
const inventory_transaction_entity_1 = require("../../entities/inventory-transaction.entity");
const room_entity_1 = require("../../entities/room.entity");
const leave_entity_1 = require("../../entities/leave.entity");
const activity_entity_1 = require("../../entities/activity.entity");
const item_requirement_entity_1 = require("../../entities/item-requirement.entity");
const staff_requirement_entity_1 = require("../../entities/staff-requirement.entity");
const room_requirement_entity_1 = require("../../entities/room-requirement.entity");
const stats_service_1 = require("./stats.service");
const stats_controller_1 = require("./stats.controller");
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                appointment_entity_1.Appointment,
                invitation_entity_1.Invitation,
                inventory_item_entity_1.InventoryItem,
                inventory_transaction_entity_1.InventoryTransaction,
                room_entity_1.Room,
                leave_entity_1.Leave,
                activity_entity_1.Activity,
                item_requirement_entity_1.ItemRequirement,
                staff_requirement_entity_1.StaffRequirement,
                room_requirement_entity_1.RoomRequirement,
            ])],
        providers: [stats_service_1.StatsService],
        controllers: [stats_controller_1.StatsController],
        exports: [stats_service_1.StatsService],
    })
], StatsModule);
