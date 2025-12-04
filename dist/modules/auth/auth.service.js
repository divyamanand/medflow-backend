"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../../entities/staff.entity");
const patient_entity_1 = require("../../entities/patient.entity");
const refresh_token_entity_1 = require("../../entities/refresh-token.entity");
const refresh_util_1 = require("./refresh.util");
const user_entity_1 = require("../../entities/user.entity");
const invitation_entity_1 = require("../../entities/invitation.entity");
const activity_service_1 = require("../activity/activity.service");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(jwt, staffRepo, patientRepo, refreshRepo, userRepo, inviteRepo, activitySvc) {
        this.jwt = jwt;
        this.staffRepo = staffRepo;
        this.patientRepo = patientRepo;
        this.refreshRepo = refreshRepo;
        this.userRepo = userRepo;
        this.inviteRepo = inviteRepo;
        this.activitySvc = activitySvc;
    }
    async validateUser(email, password) {
        if (!email || !password)
            return null;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return null;
        const isPatientType = user.role === user_entity_1.UserRole.Patient;
        if (isPatientType) {
            const patient = await this.patientRepo.findOne({ where: { user: { id: user.id } } });
            if (!patient)
                return null;
            return { id: user.id, email: user.email, role: user.role, userType: user_entity_1.UserType.Patient, patientId: patient.id };
        }
        let staff = await this.staffRepo.findOne({ where: { user: { id: user.id } } });
        if (!staff) {
            if (user.role === user_entity_1.UserRole.Admin || user.role !== user_entity_1.UserRole.Patient) {
                staff = await this.staffRepo.save(this.staffRepo.create({ user: { id: user.id } }));
            }
        }
        if (!staff)
            return null;
        return { id: user.id, email: user.email, role: user.role, userType: user_entity_1.UserType.Staff, staffId: staff.id };
    }
    signAccessToken(user) {
        return this.jwt.sign({ sub: user.id, email: user.email, role: user.role, userType: user.userType, type: 'access' }, { secret: process.env.JWT_SECRET || 'dev_secret_change_me', expiresIn: (process.env.ACCESS_TTL || '30m') });
    }
    signRefreshToken(user) {
        return this.jwt.sign({ sub: user.id, email: user.email, role: user.role, userType: user.userType, type: 'refresh' }, { secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me', expiresIn: (process.env.REFRESH_TTL || '7d') });
    }
    async login(body, res) {
        const { email, password } = body || {};
        const user = await this.validateUser(email, password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const { access, refresh } = await this.createSession(user, res);
        return { user, accessExpires: new Date(Date.now() + parseDurationMs(process.env.ACCESS_TTL || '30m')) };
    }
    async refreshCookie(req, res) {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!token)
            throw new common_1.UnauthorizedException('Missing refresh token');
        let payload;
        try {
            payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me' });
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const baseUser = await this.userRepo.findOne({ where: { id: payload.sub } });
        if (!baseUser)
            throw new common_1.UnauthorizedException('User not found');
        const isPatient = baseUser.role === user_entity_1.UserRole.Patient;
        let enriched = { id: baseUser.id, email: baseUser.email, role: baseUser.role, userType: isPatient ? user_entity_1.UserType.Patient : user_entity_1.UserType.Staff };
        if (isPatient) {
            const patient = await this.patientRepo.findOne({ where: { user: { id: baseUser.id } } });
            if (patient)
                enriched.patientId = patient.id;
        }
        else {
            const staff = await this.staffRepo.findOne({ where: { user: { id: baseUser.id } } });
            if (staff)
                enriched.staffId = staff.id;
        }
        await this.rotateTokens(enriched, res);
        return { user: enriched, accessExpires: new Date(Date.now() + parseDurationMs(process.env.ACCESS_TTL || '30m')) };
    }
    logout(res) {
        var _a, _b;
        res.clearCookie('access_token', { path: '/' });
        const r = (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.cookies) === null || _b === void 0 ? void 0 : _b.refresh_token;
        if (r) {
            const h = (0, refresh_util_1.hashRefresh)(r);
            this.refreshRepo.update({ tokenHash: h }, { revokedAt: new Date() }).catch(() => void 0);
        }
        res.clearCookie('refresh_token', { path: '/' });
        return { ok: true };
    }
    me(req) {
        return req.user || null;
    }
    setAuthCookies(res, access, refresh) {
        const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
        const common = { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };
        res.cookie('access_token', access, { ...common, maxAge: parseDurationMs(process.env.ACCESS_TTL || '30m') });
        res.cookie('refresh_token', refresh, { ...common, maxAge: parseDurationMs(process.env.REFRESH_TTL || '7d') });
    }
    refreshExpiryDate() {
        const ms = parseDurationMs(process.env.REFRESH_TTL || '7d');
        return new Date(Date.now() + ms);
    }
    async createSession(user, res) {
        const access = this.signAccessToken(user);
        const refresh = this.signRefreshToken(user);
        const tokenHash = (0, refresh_util_1.hashRefresh)(refresh);
        await this.refreshRepo.save(this.refreshRepo.create({
            userId: user.id,
            userRole: user.role,
            tokenHash,
            expiresAt: this.refreshExpiryDate(),
            revokedAt: null,
        }));
        this.setAuthCookies(res, access, refresh);
        return { access, refresh };
    }
    async rotateTokens(user, res, currentRecord) {
        if (currentRecord) {
            await this.refreshRepo.update({ id: currentRecord.id }, { revokedAt: new Date() });
        }
        return this.createSession(user, res);
    }
    async register(body) {
        const { email, password, role } = body || {};
        if (!email || !password)
            throw new common_1.BadRequestException('email and password are required');
        const exists = await this.userRepo.findOne({ where: { email } });
        if (exists)
            throw new common_1.BadRequestException('Email already in use');
        const passwordHash = await bcrypt.hash(password, 10);
        const assignedRole = role || user_entity_1.UserRole.Patient;
        const assignedType = assignedRole === user_entity_1.UserRole.Patient ? user_entity_1.UserType.Patient : user_entity_1.UserType.Staff;
        const user = await this.userRepo.save(this.userRepo.create({ email, passwordHash, role: assignedRole, type: assignedType }));
        return { id: user.id, email: user.email, role: user.role };
    }
    async invite(body) {
        const { email, type, role, staffId, patientId, expiresIn } = body || {};
        if (!email)
            throw new common_1.BadRequestException('email required');
        const existing = await this.userRepo.findOne({ where: { email } });
        if (existing)
            throw new common_1.BadRequestException('User already exists with this email');
        let assignedRole = role;
        if (type === 'patient')
            assignedRole = user_entity_1.UserRole.Patient;
        if (!assignedRole)
            throw new common_1.BadRequestException('role required');
        if (assignedRole !== user_entity_1.UserRole.Patient && !staffId && type !== 'staff')
            throw new common_1.BadRequestException('staffId required for staff');
        const token = crypto.randomBytes(32).toString('hex');
        const ttl = typeof expiresIn === 'string' ? parseDurationMs(expiresIn) : parseDurationMs('7d');
        const expiresAt = new Date(Date.now() + ttl);
        const inv = this.inviteRepo.create({ email, role: assignedRole, staffId: staffId || null, patientId: patientId || null, token, expiresAt, claimedAt: null, claimedByUserId: null });
        const saved = await this.inviteRepo.save(inv);
        return { invitationId: saved.id, token, expiresAt };
    }
    async acceptInvite(body, res) {
        const { token, password } = body || {};
        if (!token || !password)
            throw new common_1.BadRequestException('token and password required');
        const inv = await this.inviteRepo.findOne({ where: { token } });
        if (!inv)
            throw new common_1.BadRequestException('Invalid token');
        if (inv.claimedAt)
            throw new common_1.BadRequestException('Invitation already claimed');
        if (new Date(inv.expiresAt) < new Date())
            throw new common_1.BadRequestException('Invitation expired');
        const existing = await this.userRepo.findOne({ where: { email: inv.email } });
        if (existing)
            throw new common_1.BadRequestException('User already exists with this email');
        const passwordHash = await bcrypt.hash(password, 10);
        const userType = inv.role === user_entity_1.UserRole.Patient ? user_entity_1.UserType.Patient : user_entity_1.UserType.Staff;
        const user = await this.userRepo.save(this.userRepo.create({ email: inv.email, passwordHash, role: inv.role, type: userType }));
        if (inv.staffId) {
            await this.staffRepo.update({ id: inv.staffId }, { user: { id: user.id } });
        }
        if (inv.patientId) {
            await this.patientRepo.update({ id: inv.patientId }, { user: { id: user.id } });
        }
        await this.inviteRepo.update({ id: inv.id }, { claimedAt: new Date(), claimedByUserId: user.id });
        let sessionUser = { id: user.id, email: user.email, role: user.role, userType };
        if (inv.staffId)
            sessionUser.staffId = inv.staffId;
        if (inv.patientId)
            sessionUser.patientId = inv.patientId;
        await this.createSession(sessionUser, res);
        return { user: sessionUser, accessExpires: new Date(Date.now() + parseDurationMs(process.env.ACCESS_TTL || '30m')) };
    }
    async requestPasswordReset(body, ip) {
        var _a;
        const { email } = body || {};
        if (!email)
            throw new common_1.BadRequestException('email required');
        const user = await this.userRepo.findOne({ where: { email } });
        const token = crypto.randomBytes(32).toString('hex');
        const ttl = parseDurationMs(process.env.PASSWORD_RESET_TTL || '1h');
        const expiresAt = new Date(Date.now() + ttl);
        const inv = this.inviteRepo.create({ email, role: (user === null || user === void 0 ? void 0 : user.role) || user_entity_1.UserRole.Patient, staffId: null, patientId: null, token, expiresAt, claimedAt: null, claimedByUserId: null });
        await this.inviteRepo.save(inv);
        try {
            await ((_a = this.activitySvc) === null || _a === void 0 ? void 0 : _a.log(user ? user.id : null, 'request-password-reset', ip || null, { email }));
        }
        catch { }
        return { ok: true, token };
    }
    async confirmPasswordReset(body, res) {
        var _a;
        const { token, newPassword } = body || {};
        if (!token || !newPassword)
            throw new common_1.BadRequestException('token and newPassword required');
        const inv = await this.inviteRepo.findOne({ where: { token } });
        if (!inv)
            throw new common_1.BadRequestException('Invalid token');
        if (new Date(inv.expiresAt) < new Date())
            throw new common_1.BadRequestException('Token expired');
        if (inv.claimedAt)
            throw new common_1.BadRequestException('Token already used');
        const user = await this.userRepo.findOne({ where: { email: inv.email } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update({ id: user.id }, { passwordHash });
        await this.inviteRepo.update({ id: inv.id }, { claimedAt: new Date(), claimedByUserId: user.id });
        let enriched = { id: user.id, email: user.email, role: user.role, userType: user.role === user_entity_1.UserRole.Patient ? user_entity_1.UserType.Patient : user_entity_1.UserType.Staff };
        if (enriched.userType === user_entity_1.UserType.Patient) {
            const patient = await this.patientRepo.findOne({ where: { user: { id: user.id } } });
            if (patient)
                enriched.patientId = patient.id;
        }
        else {
            const staff = await this.staffRepo.findOne({ where: { user: { id: user.id } } });
            if (staff)
                enriched.staffId = staff.id;
        }
        await ((_a = this.activitySvc) === null || _a === void 0 ? void 0 : _a.log(user.id, 'confirm-password-reset', null, {}));
        await this.createSession(enriched, res);
        return { ok: true, user: enriched, accessExpires: new Date(Date.now() + parseDurationMs(process.env.ACCESS_TTL || '30m')) };
    }
    async resetPassword(body) {
        var _a;
        const { userId, newPassword } = body || {};
        if (!userId || !newPassword)
            throw new common_1.BadRequestException('userId and newPassword required');
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('user not found');
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update({ id: userId }, { passwordHash });
        try {
            await ((_a = this.activitySvc) === null || _a === void 0 ? void 0 : _a.log(user.id, 'admin-reset-password', null, {}));
        }
        catch { }
        return { ok: true };
    }
    async bootstrapAdmin(body, res) {
        const { email, password, firstName = 'Admin', lastName = '', secret } = body || {};
        if (!email || !password)
            throw new common_1.BadRequestException('email and password are required');
        const count = await this.userRepo.count();
        const bootSecret = process.env.BOOTSTRAP_SECRET;
        if (count > 0) {
            if (!bootSecret || secret !== bootSecret) {
                throw new common_1.ForbiddenException('bootstrap disabled (already initialized)');
            }
        }
        const existing = await this.userRepo.findOne({ where: { email } });
        if (existing)
            throw new common_1.BadRequestException('Email already in use');
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await this.userRepo.save(this.userRepo.create({ email, passwordHash, role: user_entity_1.UserRole.Admin, type: user_entity_1.UserType.Staff, firstName, lastName }));
        const staff = await this.staffRepo.save(this.staffRepo.create({ user: { id: user.id } }));
        const sessionUser = { id: user.id, email: user.email, role: user.role, userType: user_entity_1.UserType.Staff, staffId: staff.id };
        await this.createSession(sessionUser, res);
        return { user: sessionUser };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(2, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(3, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activity_service_1.ActivityService])
], AuthService);
function parseDurationMs(input) {
    const m = String(input).match(/^(\d+)([smhd])$/);
    if (!m)
        return 15 * 60 * 1000;
    const n = parseInt(m[1], 10);
    const mult = m[2] === 's' ? 1000 : m[2] === 'm' ? 60000 : m[2] === 'h' ? 3600000 : 86400000;
    return n * mult;
}
