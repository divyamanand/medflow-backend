import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('specialties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialtyController {
  constructor(private readonly svc: SpecialtyService) {}

  @Get()
  @Roles('admin', 'receptionist', 'doctor', 'patient')
  list(@Query() query: any) {
    return this.svc.findAll(query);
  }

  @Get('search')
  @Roles('admin', 'receptionist', 'doctor', 'patient')
  search(@Query('keyword') keyword: string) {
    return this.svc.searchByName(keyword || '');
  }

  @Post()
  @Roles('admin')
  create(@Body() body: { code: string; name: string; description?: string }) {
    return this.svc.create(body);
  }

  @Get(':id')
  @Roles('admin', 'receptionist', 'doctor')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Get(':id/staff')
  @Roles('admin', 'receptionist')
  getStaff(@Param('id') id: string) {
    return this.svc.getStaffBySpecialty(id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: Partial<{ code: string; name: string; description: string }>) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
