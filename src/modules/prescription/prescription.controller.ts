import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionController {
  constructor(private readonly svc: PrescriptionService) {}

  @Get()
  @Roles('admin','doctor','pharmacist','patient')
  list(@Query() q: any, @Req() req: any) {
    const filter: any = {};
    if (q.patientId) filter.patientId = q.patientId;
    if (q.doctorId) filter.doctorId = q.doctorId;
    if (q.from) filter.from = q.from;
    if (q.to) filter.to = q.to;
    
    if (req.user.role === 'patient') {
      filter.patientId = req.user.patientId;
    }
    
    return this.svc.findAll(filter);
  }

  @Post()
  @Roles('admin','doctor')
  create(@Body() body: any, @Req() req: any) {
    if (req.user.role === 'doctor') {
      body.doctorId = req.user.staffId;
    }
    return this.svc.create(body);
  }

  @Get(':id')
  @Roles('admin','doctor','pharmacist','patient')
  async getOne(@Param('id') id: string, @Req() req: any) {
    const prescription = await this.svc.findOne(id);
    if (!prescription) throw new NotFoundException('Prescription not found');
  
    if (req.user.role === 'patient') {
      if (prescription.patient?.id !== req.user.patientId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    
    return prescription;
  }

  @Put(':id')
  @Roles('admin','doctor')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (req.user.role === 'doctor') {
      const existing = await this.svc.findOne(id);
      if (!existing) throw new NotFoundException('Prescription not found');
      if (existing.doctor?.id !== req.user.staffId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @Roles('admin','doctor')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role === 'doctor') {
      const existing = await this.svc.findOne(id);
      if (!existing) throw new NotFoundException('Prescription not found');
      if (existing.doctor?.id !== req.user.staffId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    return this.svc.remove(id);
  }

  @Post(':prescriptionId/items')
  @Roles('admin','doctor')
  async addItem(@Param('prescriptionId') prescriptionId: string, @Body() body: any, @Req() req: any) {
    if (req.user.role === 'doctor') {
      const existing = await this.svc.findOne(prescriptionId);
      if (!existing) throw new NotFoundException('Prescription not found');
      if (existing.doctor?.id !== req.user.staffId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    return this.svc.addItem(prescriptionId, body);
  }

  @Put(':prescriptionId/items/:itemId')
  @Roles('admin','doctor')
  async updateItem(
    @Param('prescriptionId') prescriptionId: string,
    @Param('itemId') itemId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    if (req.user.role === 'doctor') {
      const existing = await this.svc.findOne(prescriptionId);
      if (!existing) throw new NotFoundException('Prescription not found');
      if (existing.doctor?.id !== req.user.staffId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    return this.svc.updateItem(itemId, body);
  }

  @Delete(':prescriptionId/items/:itemId')
  @Roles('admin','doctor')
  async removeItem(
    @Param('prescriptionId') prescriptionId: string,
    @Param('itemId') itemId: string,
    @Req() req: any
  ) {
    if (req.user.role === 'doctor') {
      const existing = await this.svc.findOne(prescriptionId);
      if (!existing) throw new NotFoundException('Prescription not found');
      if (existing.doctor?.id !== req.user.staffId) {
        throw new ForbiddenException('Not allowed');
      }
    }
    return this.svc.removeItem(itemId);
  }
}
