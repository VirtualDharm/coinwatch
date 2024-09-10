// src/modules/price-tracker/price-tracker.module.ts
import { Module } from '@nestjs/common';
import { PriceTrackerService } from './price-tracker.service';
import { PriceTrackerController } from './price-tracker.controller';

@Module({
  providers: [PriceTrackerService],
  controllers: [PriceTrackerController],
  exports: [PriceTrackerService],
})
export class PriceTrackerModule {}