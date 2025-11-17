import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { BootstrapService } from './bootstrap.service';
import { BootstrapController } from './bootstrap.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [BootstrapService],
  controllers: [BootstrapController],
})
export class BootstrapModule {}
