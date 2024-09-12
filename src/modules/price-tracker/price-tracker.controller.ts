// src/modules/price-tracker/price-tracker.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PriceTrackerService } from './price-tracker.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Prices')
@Controller('prices')
export class PriceTrackerController {
  constructor(private readonly priceTrackerService: PriceTrackerService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 100 hours' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of prices.' })
  async getHourlyPrices(@Query('chain') chain: string) {
    return await this.priceTrackerService.getHourlyPrices(chain);
  }
}