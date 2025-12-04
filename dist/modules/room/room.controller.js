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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let RoomController = class RoomController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q) {
        const filter = {};
        if (q.status)
            filter.status = q.status;
        if (q.type)
            filter.type = q.type;
        if (q.capacityMin)
            filter.capacityMin = parseInt(q.capacityMin, 10);
        if (q.capacityMax)
            filter.capacityMax = parseInt(q.capacityMax, 10);
        if (q.patientId)
            filter.patientId = q.patientId;
        if (q.available === 'true')
            filter.available = true;
        return this.svc.findAll(filter);
    }
    get(id) { return this.svc.findOne(id); }
    create(body) { return this.svc.create(body); }
    update(id, body) { return this.svc.update(id, body); }
    remove(id) { return this.svc.remove(id); }
    book(id, body) { return this.svc.book(id, body); }
    changeStatus(id, body) { return this.svc.changeStatus(id, body.status); }
    assign(id, body) { return this.svc.assign(id, body); }
    available(type) { return this.svc.findAvailable(type); }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "book", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)('available/list'),
    (0, roles_decorator_1.Roles)('admin', 'room_manager'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "available", null);
exports.RoomController = RoomController = __decorate([
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
