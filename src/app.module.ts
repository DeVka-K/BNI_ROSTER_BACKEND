// src/app.module.ts
import { Module } from '@nestjs/common';
import { JsonToPdfModule } from './json-to-pdf/json-to-pdf.module';

@Module({
  imports: [JsonToPdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
