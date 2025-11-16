import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from '../../entities/staff.entity';
import { Timings } from '../../entities/timings.entity';
import { Leave } from '../../entities/leave.entity';
import { User } from '../../entities/user.entity';
import { StaffRequirement } from '../../entities/staff-requirement.entity';
import { StaffRequirementFulfillment } from '../../entities/staff-requirement-fulfillment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Timings, Leave, User, StaffRequirement, StaffRequirementFulfillment])],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService]
})
export class StaffModule {}
