// src/modules/common/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Initialize the transporter with Gmail SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });
  }

  // Sends an email when a price target is reached
  async sendPriceTargetAlert(email: string, chain: string, price: number) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Price Alert for ${chain}`,
      text: `The price of ${chain} has reached $${price}.`,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Price target alert sent to ${email}`);
  }

  // Sends an email when the price increases by more than 3% in the last hour
  async sendPriceIncreaseAlert(chain: string, price: number) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Increase Alert for ${chain}`,
      text: `The price of ${chain} has increased by more than 3% in the last hour. Current price: $${price}.`,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Price increase alert sent to hyperhire_assignment@hyperhire.in`);
  }
}