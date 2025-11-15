"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const requirement_service_1 = require("./requirement.service");
const requirement_controller_1 = require("./requirement.controller");
const item_requirement_entity_1 = require("../../entities/item-requirement.entity");
const item_requirement_fulfillment_entity_1 = require("../../entities/item-requirement-fulfillment.entity");
const staff_requirement_entity_1 = require("../../entities/staff-requirement.entity");
const staff_requirement_fulfillment_entity_1 = require("../../entities/staff-requirement-fulfillment.entity");
const room_requirement_entity_1 = require("../../entities/room-requirement.entity");
const room_requirement_fulfillment_entity_1 = require("../../entities/room-requirement-fulfillment.entity");
const inventory_item_entity_1 = require("../../entities/inventory-item.entity");
const inventory_transaction_entity_1 = require("../../entities/inventory-transaction.entity");
const staff_entity_1 = require("../../entities/staff.entity");
const room_entity_1 = require("../../entities/room.entity");
let RequirementModule = class RequirementModule {
};
exports.RequirementModule = RequirementModule;
exports.RequirementModule = RequirementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                item_requirement_entity_1.ItemRequirement,
                item_requirement_fulfillment_entity_1.ItemRequirementFulfillment,
                staff_requirement_entity_1.StaffRequirement,
                staff_requirement_fulfillment_entity_1.StaffRequirementFulfillment,
                room_requirement_entity_1.RoomRequirement,
                room_requirement_fulfillment_entity_1.RoomRequirementFulfillment,
                inventory_item_entity_1.InventoryItem,
                inventory_transaction_entity_1.InventoryTransaction,
                staff_entity_1.Staff,
                room_entity_1.Room,
            ]),
        ],
        controllers: [requirement_controller_1.RequirementController],
        providers: [requirement_service_1.RequirementService],
    })
], RequirementModule);
