// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTrackerModule } from './modules/price-tracker/price-tracker.module';
import { AlertModule } from './modules/alerts/alert.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './modules/tasks/task.service';
import { EmailService } from './modules/common/email.service'; // Import EmailService

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'price_tracker',
      synchronize: false, // Schema is managed manually
    }),
    ScheduleModule.forRoot(), // Enables scheduling (cron jobs)
    PriceTrackerModule,
    AlertModule,
  ],
  providers: [TaskService, EmailService],
})
export class AppModule {}
