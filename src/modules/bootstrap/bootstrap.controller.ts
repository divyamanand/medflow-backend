import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';

@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly svc: BootstrapService) {}

  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() body: any, @Headers('x-bootstrap-secret') secret?: string) {
    return this.svc.createAdmin(body, secret);
  }
}
