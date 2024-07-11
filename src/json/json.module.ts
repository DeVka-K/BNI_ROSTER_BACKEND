import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { PdfModule } from '../pdf/pdf.module';
import { MulterModule } from '@nestjs/platform-express';
import { CqrsModule } from '@nestjs/cqrs';
import { ConvertJsonHandler } from './commands/convert-json.handler';
import { JsonConvertedHandler } from './events/json-converted.handler';
import { GetPreviewHandler } from './queries/get-preview.handler';

@Module({
  imports: [
    PdfModule,
    MulterModule.register({
      dest: './uploads',
    }),
    CqrsModule,
  ],
  controllers: [JsonController],
  providers: [
    JsonService,
    ConvertJsonHandler,
    JsonConvertedHandler,
    GetPreviewHandler,
  ],
})
export class JsonModule {}

