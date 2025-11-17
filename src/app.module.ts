import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { PatientModule } from './modules/patient/patient.module';
import { StaffModule } from './modules/staff/staff.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { PrescriptionModule } from './modules/prescription/prescription.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { RequirementModule } from './modules/requirement/requirement.module';
import { UserModule } from './modules/user/user.module';
import { StatsModule } from './modules/stats/stats.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ActivityModule } from './modules/activity/activity.module';
import { ActivityInterceptor } from './modules/activity/activity.interceptor';
import { LeaveModule } from './modules/leave/leave.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DB_URL || process.env.DATABASE_URL;
        if (!url) {
          throw new Error('DATABASE_URL/DB_URL is required (pg connection string). Example: postgresql://user:pass@host:5432/dbname?sslmode=require');
        }
        const hostFromUrl = (() => { try { return new URL(url).hostname || ''; } catch { return ''; } })();
        const urlRequiresSSL = url.includes('sslmode=require') || hostFromUrl.includes('supabase.co') || hostFromUrl.includes('supabase.com');
        const useSSL = (process.env.DB_SSL === 'true') || urlRequiresSSL;
        const sslExtra = useSSL ? { rejectUnauthorized: false } : undefined;
        return {
          type: 'postgres',
          url,
          entities: [join(__dirname, '/entities/*{.ts,.js}')],
          synchronize: true,
          ssl: useSSL ? true : false,
          extra: useSSL ? { ssl: sslExtra } : undefined,
        } as any;
      },
    }),
    PatientModule,
    StaffModule,
    AppointmentModule,
    PrescriptionModule,
    InventoryModule,
    RoomModule,
    AuthModule,
    SpecialtyModule,
    RequirementModule,
    ActivityModule,
    LeaveModule,
    StatsModule,
    UserModule,
    BootstrapModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
