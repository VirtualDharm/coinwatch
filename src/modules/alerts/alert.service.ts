// src/modules/alerts/alert.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EmailService } from '../common/email.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly emailService: EmailService,
  ) {}

  // Sets a new alert
  async setAlert(chain: string, targetPrice: number, email: string) {
    await this.connection.query(
      `INSERT INTO alert (chain, target_price, email) VALUES ($1, $2, $3)`,
      [chain, targetPrice, email],
    );
    this.logger.log(`Alert set for ${chain} at price ${targetPrice}`);
  }

  // Checks if any alerts need to be triggered
  async checkPriceAlerts(chain: string, currentPrice: number) {
    const alerts = await this.connection.query(
      `SELECT * FROM alert WHERE chain = $1 AND target_price <= $2 AND is_triggered = FALSE`,
      [chain, currentPrice],
    );

    for (const alert of alerts) {
      await this.emailService.sendPriceTargetAlert(
        alert.email,
        chain,
        currentPrice,
      );

      // Mark the alert as triggered
      await this.connection.query(
        `UPDATE alert SET is_triggered = TRUE WHERE id = $1`,
        [alert.id],
      );
      this.logger.log(`Alert triggered and email sent to ${alert.email}`);
    }
  }
}