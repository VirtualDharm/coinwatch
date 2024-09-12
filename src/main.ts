// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config(); // Load environment variables
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true,
  });

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CoinWatch')
    .setDescription('API to track and alert blockchain prices')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    Logger.log('Server is running on http://localhost:3000', 'Bootstrap');
    Logger.log('Swagger is available at http://localhost:3000/api', 'Bootstrap');
  });
}
bootstrap();
