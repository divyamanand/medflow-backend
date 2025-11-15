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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("../../entities/refresh-token.entity");
const refresh_util_1 = require("./refresh.util");
const auth_service_1 = require("./auth.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(jwt, refreshRepo, authSvc) {
        this.jwt = jwt;
        this.refreshRepo = refreshRepo;
        this.authSvc = authSvc;
    }
    async use(req, res, next) {
        var _a, _b, _c;
        if ((_a = req.path) === null || _a === void 0 ? void 0 : _a.startsWith('/auth/'))
            return next();
        const access = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.access_token;
        const refresh = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.refresh_token;
        if (access) {
            try {
                const payload = await this.jwt.verifyAsync(access, { secret: process.env.JWT_SECRET || 'dev_secret_change_me' });
                req.user = { ...payload, id: payload === null || payload === void 0 ? void 0 : payload.sub };
                return next();
            }
            catch (e) {
            }
        }
        if (refresh) {
            try {
                const payload = await this.jwt.verifyAsync(refresh, { secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me' });
                const h = (0, refresh_util_1.hashRefresh)(refresh);
                const rec = await this.refreshRepo.findOne({ where: { tokenHash: h } });
                if (!rec || rec.revokedAt)
                    throw new common_1.UnauthorizedException('Refresh revoked');
                if (rec.expiresAt && new Date(rec.expiresAt) < new Date())
                    throw new common_1.UnauthorizedException('Refresh expired');
                const user = { id: payload.sub, email: payload.email, role: payload.role, userType: payload.userType || (payload.role === 'patient' ? 'patient' : 'staff') };
                const tokens = await this.authSvc.rotateTokens(user, res, rec);
                req.user = { ...payload, id: payload.sub };
                return next();
            }
            catch (e) {
                res.clearCookie('access_token', { path: '/' });
                res.clearCookie('refresh_token', { path: '/' });
                throw new common_1.UnauthorizedException('Authentication required');
            }
        }
        return next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], AuthMiddleware);
