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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const leave_service_1 = require("./leave.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let LeaveController = class LeaveController {
    constructor(svc) {
        this.svc = svc;
    }
    list(q) {
        const filter = {};
        if (q.staffId)
            filter.staffId = q.staffId;
        if (q.status)
            filter.status = q.status;
        if (q.from)
            filter.from = q.from;
        if (q.to)
            filter.to = q.to;
        if (q.active === 'true')
            filter.active = true;
        return this.svc.list(filter);
    }
    create(body) { return this.svc.create(body); }
    get(id) { return this.svc.findOne(id); }
    approve(id) { return this.svc.transition(id, 'approve'); }
    reject(id, body) { return this.svc.transition(id, 'reject', body === null || body === void 0 ? void 0 : body.reason); }
    cancel(id, body) { return this.svc.transition(id, 'cancel', body === null || body === void 0 ? void 0 : body.reason); }
    edit(id, body) { return this.svc.update(id, body); }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/edit'),
    (0, roles_decorator_1.Roles)('admin', 'receptionist'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "edit", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)('leaves'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
