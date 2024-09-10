// src/modules/alerts/alert.module.ts
import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { EmailService } from '../common/email.service';

@Module({
  providers: [AlertService, EmailService],
  controllers: [AlertController],
  exports: [AlertService],
})
export class AlertModule {}