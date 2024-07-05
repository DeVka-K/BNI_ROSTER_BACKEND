// src/json-to-pdf/json-to-pdf.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JsonToPdfService } from './json-to-pdf.service';
import { JsonToPdfController } from './json-to-pdf.controller';
import { GetJsonToPdfHandler } from './queries/handlers/get-json-to-pdf.handlers';

@Module({
  imports: [CqrsModule],
  controllers: [JsonToPdfController],
  providers: [JsonToPdfService, GetJsonToPdfHandler],
})
export class JsonToPdfModule {}
