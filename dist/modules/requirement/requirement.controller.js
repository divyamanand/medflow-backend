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
exports.RequirementController = void 0;
const common_1 = require("@nestjs/common");
const requirement_service_1 = require("./requirement.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let RequirementController = class RequirementController {
    constructor(svc) {
        this.svc = svc;
    }
    listItemRequirements() { return this.svc.listItemRequirements(); }
    createItemRequirement(body) { return this.svc.createItemRequirement(body); }
    getItemRequirement(id) { return this.svc.getItemRequirement(id); }
    updateItemRequirement(id, body) { return this.svc.updateItemRequirement(id, body); }
    listItemFulfillments(id) { return this.svc.listItemFulfillments(id); }
    createItemFulfillment(id, body) { return this.svc.createItemFulfillment(id, body); }
    updateItemFulfillment(fid, body) { return this.svc.updateItemFulfillment(fid, body); }
    listStaffRequirements() { return this.svc.listStaffRequirements(); }
    createStaffRequirement(body) { return this.svc.createStaffRequirement(body); }
    getStaffRequirement(id) { return this.svc.getStaffRequirement(id); }
    updateStaffRequirement(id, body) { return this.svc.updateStaffRequirement(id, body); }
    listStaffFulfillments(id) { return this.svc.listStaffFulfillments(id); }
    createStaffFulfillment(id, body) { return this.svc.createStaffFulfillment(id, body); }
    updateStaffFulfillment(fid, body) { return this.svc.updateStaffFulfillment(fid, body); }
    listRoomRequirements() { return this.svc.listRoomRequirements(); }
    createRoomRequirement(body) { return this.svc.createRoomRequirement(body); }
    getRoomRequirement(id) { return this.svc.getRoomRequirement(id); }
    updateRoomRequirement(id, body) { return this.svc.updateRoomRequirement(id, body); }
    listRoomFulfillments(id) { return this.svc.listRoomFulfillments(id); }
    createRoomFulfillment(id, body) { return this.svc.createRoomFulfillment(id, body); }
    updateRoomFulfillment(fid, body) { return this.svc.updateRoomFulfillment(fid, body); }
    getItemFulfillmentsAggregate() { return this.svc.getItemFulfillmentsTable(); }
    getStaffFulfillmentsAggregate() { return this.svc.getStaffFulfillmentsTable(); }
    getRoomFulfillmentsAggregate() { return this.svc.getRoomFulfillmentsTable(); }
};
exports.RequirementController = RequirementController;
__decorate([
    (0, common_1.Get)('requirements/items'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listItemRequirements", null);
__decorate([
    (0, common_1.Post)('requirements/items'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createItemRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/items/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getItemRequirement", null);
__decorate([
    (0, common_1.Patch)('requirements/items/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateItemRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/items/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listItemFulfillments", null);
__decorate([
    (0, common_1.Post)('requirements/items/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createItemFulfillment", null);
__decorate([
    (0, common_1.Patch)('requirements/items/fulfillments/:fid'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('fid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateItemFulfillment", null);
__decorate([
    (0, common_1.Get)('requirements/staff'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listStaffRequirements", null);
__decorate([
    (0, common_1.Post)('requirements/staff'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createStaffRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/staff/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getStaffRequirement", null);
__decorate([
    (0, common_1.Patch)('requirements/staff/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateStaffRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/staff/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listStaffFulfillments", null);
__decorate([
    (0, common_1.Post)('requirements/staff/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createStaffFulfillment", null);
__decorate([
    (0, common_1.Patch)('requirements/staff/fulfillments/:fid'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('fid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateStaffFulfillment", null);
__decorate([
    (0, common_1.Get)('requirements/rooms'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listRoomRequirements", null);
__decorate([
    (0, common_1.Post)('requirements/rooms'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createRoomRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/rooms/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getRoomRequirement", null);
__decorate([
    (0, common_1.Patch)('requirements/rooms/:id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateRoomRequirement", null);
__decorate([
    (0, common_1.Get)('requirements/rooms/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "listRoomFulfillments", null);
__decorate([
    (0, common_1.Post)('requirements/rooms/:id/fulfillments'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "createRoomFulfillment", null);
__decorate([
    (0, common_1.Patch)('requirements/rooms/fulfillments/:fid'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('fid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "updateRoomFulfillment", null);
__decorate([
    (0, common_1.Get)('fulfillments/items'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getItemFulfillmentsAggregate", null);
__decorate([
    (0, common_1.Get)('fulfillments/staff'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getStaffFulfillmentsAggregate", null);
__decorate([
    (0, common_1.Get)('fulfillments/rooms'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequirementController.prototype, "getRoomFulfillmentsAggregate", null);
exports.RequirementController = RequirementController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [requirement_service_1.RequirementService])
], RequirementController);
