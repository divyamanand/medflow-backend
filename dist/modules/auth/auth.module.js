"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const staff_entity_1 = require("../../entities/staff.entity");
const patient_entity_1 = require("../../entities/patient.entity");
const refresh_token_entity_1 = require("../../entities/refresh-token.entity");
const user_entity_1 = require("../../entities/user.entity");
const invitation_entity_1 = require("../../entities/invitation.entity");
const activity_module_1 = require("../activity/activity.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([staff_entity_1.Staff, patient_entity_1.Patient, refresh_token_entity_1.RefreshToken, user_entity_1.User, invitation_entity_1.Invitation]),
            activity_module_1.ActivityModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'dev_secret_change_me',
                signOptions: { expiresIn: '30m' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard],
        exports: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard, typeorm_1.TypeOrmModule],
    })
], AuthModule);
