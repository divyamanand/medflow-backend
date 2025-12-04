"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const patient_module_1 = require("./modules/patient/patient.module");
const staff_module_1 = require("./modules/staff/staff.module");
const appointment_module_1 = require("./modules/appointment/appointment.module");
const prescription_module_1 = require("./modules/prescription/prescription.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const room_module_1 = require("./modules/room/room.module");
const auth_module_1 = require("./modules/auth/auth.module");
const specialty_module_1 = require("./modules/specialty/specialty.module");
const user_module_1 = require("./modules/user/user.module");
const stats_module_1 = require("./modules/stats/stats.module");
const auth_middleware_1 = require("./modules/auth/auth.middleware");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const activity_module_1 = require("./modules/activity/activity.module");
const activity_interceptor_1 = require("./modules/activity/activity.interceptor");
const leave_module_1 = require("./modules/leave/leave.module");
const bootstrap_module_1 = require("./modules/bootstrap/bootstrap.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const url = process.env.DB_URL || process.env.DATABASE_URL;
                    if (!url) {
                        throw new Error('DATABASE_URL/DB_URL is required (pg connection string). Example: postgresql://user:pass@host:5432/dbname?sslmode=require');
                    }
                    const hostFromUrl = (() => { try {
                        return new URL(url).hostname || '';
                    }
                    catch {
                        return '';
                    } })();
                    const urlRequiresSSL = url.includes('sslmode=require') || hostFromUrl.includes('supabase.co') || hostFromUrl.includes('supabase.com');
                    const useSSL = (process.env.DB_SSL === 'true') || urlRequiresSSL;
                    const sslExtra = useSSL ? { rejectUnauthorized: false } : undefined;
                    return {
                        type: 'postgres',
                        url,
                        entities: [(0, path_1.join)(__dirname, '/entities/*{.ts,.js}')],
                        synchronize: true,
                        ssl: useSSL ? true : false,
                        extra: useSSL ? { ssl: sslExtra } : undefined,
                    };
                },
            }),
            patient_module_1.PatientModule,
            staff_module_1.StaffModule,
            appointment_module_1.AppointmentModule,
            prescription_module_1.PrescriptionModule,
            inventory_module_1.InventoryModule,
            room_module_1.RoomModule,
            auth_module_1.AuthModule,
            specialty_module_1.SpecialtyModule,
            activity_module_1.ActivityModule,
            leave_module_1.LeaveModule,
            stats_module_1.StatsModule,
            user_module_1.UserModule,
            bootstrap_module_1.BootstrapModule,
        ],
        providers: [
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
            { provide: core_1.APP_INTERCEPTOR, useClass: activity_interceptor_1.ActivityInterceptor },
        ],
    })
], AppModule);
