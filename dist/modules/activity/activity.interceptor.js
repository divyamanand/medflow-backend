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
exports.ActivityInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const activity_service_1 = require("./activity.service");
let ActivityInterceptor = class ActivityInterceptor {
    constructor(activitySvc) {
        this.activitySvc = activitySvc;
    }
    intercept(context, next) {
        var _a;
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const ip = req.ip || ((_a = req.headers) === null || _a === void 0 ? void 0 : _a['x-forwarded-for']) || null;
        const action = `${req.method} ${req.originalUrl || req.url}`;
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            var _a;
            const duration = Date.now() - start;
            try {
                this.activitySvc.log((_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : null, action, ip !== null && ip !== void 0 ? ip : null, { duration });
            }
            catch (e) {
            }
        }));
    }
};
exports.ActivityInterceptor = ActivityInterceptor;
exports.ActivityInterceptor = ActivityInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityInterceptor);
