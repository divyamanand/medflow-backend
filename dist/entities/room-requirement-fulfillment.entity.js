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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRequirementFulfillment = void 0;
const typeorm_1 = require("typeorm");
const room_requirement_entity_1 = require("./room-requirement.entity");
const room_entity_1 = require("./room.entity");
let RoomRequirementFulfillment = class RoomRequirementFulfillment {
};
exports.RoomRequirementFulfillment = RoomRequirementFulfillment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoomRequirementFulfillment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_requirement_entity_1.RoomRequirement, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requirementId' }),
    __metadata("design:type", room_requirement_entity_1.RoomRequirement)
], RoomRequirementFulfillment.prototype, "requirement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_entity_1.Room)
], RoomRequirementFulfillment.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], RoomRequirementFulfillment.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], RoomRequirementFulfillment.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], RoomRequirementFulfillment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoomRequirementFulfillment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RoomRequirementFulfillment.prototype, "updatedAt", void 0);
exports.RoomRequirementFulfillment = RoomRequirementFulfillment = __decorate([
    (0, typeorm_1.Entity)({ name: 'room_requirement_fulfillment' })
], RoomRequirementFulfillment);
