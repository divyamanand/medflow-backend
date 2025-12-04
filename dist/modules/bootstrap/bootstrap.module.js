"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const staff_entity_1 = require("../../entities/staff.entity");
const bootstrap_service_1 = require("./bootstrap.service");
const bootstrap_controller_1 = require("./bootstrap.controller");
let BootstrapModule = class BootstrapModule {
};
exports.BootstrapModule = BootstrapModule;
exports.BootstrapModule = BootstrapModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, staff_entity_1.Staff])],
        providers: [bootstrap_service_1.BootstrapService],
        controllers: [bootstrap_controller_1.BootstrapController],
    })
], BootstrapModule);
