

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import * as cors from 'cors'; // Import cors module

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all origins (you can customize this based on your requirements)
  app.use(cors());

  app.setGlobalPrefix('api'); // This adds the /api prefix to all routes

  app.use('/pdfs', express.static(join(process.cwd(), 'pdfs')));

  await app.listen(4000);
}
bootstrap();

