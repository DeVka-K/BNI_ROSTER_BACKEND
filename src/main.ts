// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3001);
// }
// bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cors from 'cors';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS
//   app.use(cors());

//   await app.listen(5000); // Change port number here
// }

// bootstrap();
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for all routes
  await app.listen(4000);
}
bootstrap();


