import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Get('inventory')
  @Roles('admin','pharmacist','inventory')
  list(@Query() q: any) {
    const filter: any = {};
    if (q.itemType) filter.itemType = q.itemType;
    if (q.lowStock) filter.lowStock = parseInt(q.lowStock,10);
    if (q.expiryBefore) filter.expiryBefore = q.expiryBefore;
    if (q.expiry) filter.expiryBefore = q.expiry; 
    return this.svc.listStocks(filter);
  }

  @Get('inventory/type/:type')
  @Roles('admin','pharmacist','inventory')
  listByType(@Param('type') type: string) { 
    return this.svc.listStocks({ itemType: type });
  }

  @Get('inventory/by-name/:name')
  @Roles('admin','pharmacist','inventory')
  getByName(@Param('name') name: string) { 
    return this.svc.searchItemsByName(name); 
  }

  @Get('inventory/transactions')
  @Roles('admin','pharmacist','inventory')
  listTransactions(@Query() q: any) {
    const filter: any = {};
    if (q.itemId) filter.itemId = q.itemId;
    if (q.type) filter.type = q.type;
    if (q.from) filter.from = q.from;
    if (q.to) filter.to = q.to;
    return this.svc.listTransactions(filter);
  }

  @Delete('inventory/remove-expired')
  @Roles('admin','pharmacist','inventory')
  removeExpired() { 
    return this.svc.removeExpiredStocks(); 
  }

  @Post('inventory')
  @Roles('admin','pharmacist','inventory')
  createItem(@Body() body: { name: string; type: "medicine" | "equipment" | "blood" | "supply"; manufacturer?: string; description?: string }) { 
    return this.svc.createItem(body); 
  }

  @Get('inventory/:id')
  @Roles('admin','pharmacist','inventory')
  getItem(@Param('id') id: string) { 
    return this.svc.getItem(id); 
  }

  @Put('inventory/:id')
  @Roles('admin','pharmacist','inventory')
  updateItem(@Param('id') id: string, @Body() body: any) { 
    return this.svc.updateItem(id, body); 
  }

  @Delete('inventory/:id')
  @Roles('admin','pharmacist','inventory')
  deleteItem(@Param('id') id: string) { 
    return this.svc.deleteItem(id); 
  }


  @Get('inventory/:itemId/stock')
  @Roles('admin','pharmacist','inventory')
  listStock(@Param('itemId') itemId: string) {
    return this.svc.listStock(itemId);
  }

  @Post('inventory/:itemId/stock')
  @Roles('admin','pharmacist','inventory')
  addStock(
    @Param('itemId') itemId: string, 
    @Body() body: { quantity: number; expiry?: string; notes?: string; }
  ) {
    return this.svc.addStock(itemId, body.quantity, body.expiry, body.notes);
  }

  @Get('inventory/:itemId/stock/:stockId')
  @Roles('admin','pharmacist','inventory')
  getStock(@Param('itemId') itemId: string, @Param('stockId') stockId: string) {
    return this.svc.getStock(stockId);
  }

  @Put('inventory/:itemId/stock/:stockId')
  @Roles('admin','pharmacist','inventory')
  updateStock(
    @Param('itemId') itemId: string, 
    @Param('stockId') stockId: string, 
    @Body() body: { quantity?: number; expiry?: string; notes?: string }
  ) {
    return this.svc.updateStock(stockId, body);
  }

  @Delete('inventory/:itemId/stock/:stockId')
  @Roles('admin','pharmacist','inventory')
  deleteStock(@Param('itemId') itemId: string, @Param('stockId') stockId: string) {
    return this.svc.deleteStock(stockId);
  }


  @Post('prescription/:id/fulfill')
  @Roles('admin','pharmacist','inventory')
  fulfillPrescription(@Param('id') id: string) { 
    return this.svc.fulfillPrescription(id); 
  }

  @Post('inventory/:id/adjust')
  @Roles('admin','pharmacist','inventory')
  adjust(@Param('id') id: string, @Body() body: { change: number; reason?: string; referenceId?: string }) {
    return this.svc.adjustItem(id, { quantity: body.change, reason: body.reason, refPrescriptionItemId: body.referenceId });
  }

  @Post('inventory/:id/dispense')
  @Roles('admin','pharmacist','inventory')
  dispense(@Param('id') id: string, @Body() body: { quantity: number; referenceId?: string }) { 
    return this.svc.dispenseItem(id, body?.quantity, body?.referenceId); 
  }
}
