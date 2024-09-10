// src/modules/tasks/task.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PriceTrackerService } from '../price-tracker/price-tracker.service';
import { AlertService } from '../alerts/alert.service';
import { EmailService } from '../common/email.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly priceTrackerService: PriceTrackerService,
    private readonly alertService: AlertService,
    private readonly emailService: EmailService,
  ) {}

  // Runs every 5 minutes
  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.log('Running scheduled tasks...');
    await this.priceTrackerService.fetchPrices();

    // Check for Ethereum
    const ethereumPrice = await this.priceTrackerService.getEthereumPrice();
    const ethereumPriceIncreased = await this.priceTrackerService.checkPriceIncrease(
      'Ethereum',
      ethereumPrice,
    );
    if (ethereumPriceIncreased) {
      await this.emailService.sendPriceIncreaseAlert('Ethereum', ethereumPrice);
    }
    await this.alertService.checkPriceAlerts('Ethereum', ethereumPrice);

    // Check for Polygon
    const polygonPrice = await this.priceTrackerService.getPolygonPrice();
    const polygonPriceIncreased = await this.priceTrackerService.checkPriceIncrease(
      'Polygon',
      polygonPrice,
    );
    if (polygonPriceIncreased) {
      await this.emailService.sendPriceIncreaseAlert('Polygon', polygonPrice);
    }
    await this.alertService.checkPriceAlerts('Polygon', polygonPrice);
  }
}