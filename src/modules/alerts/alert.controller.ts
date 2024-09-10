// src/modules/alerts/alert.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('set')
  @ApiOperation({ summary: 'Set a new price alert' })
  @ApiResponse({ status: 201, description: 'Alert set successfully.' })
  async setAlert(@Body() body: any) {
    const { chain, targetPrice, email } = body;
    await this.alertService.setAlert(chain, targetPrice, email);
    return { message: 'Alert set successfully' };
  }
}