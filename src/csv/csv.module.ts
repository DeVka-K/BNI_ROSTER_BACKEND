
import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { PdfModule } from '../pdf/pdf.module';
import { MulterModule } from '@nestjs/platform-express';
import { CqrsModule } from '@nestjs/cqrs';
import { ConvertCsvHandler } from './commands/convert-csv.handler';
import { CsvConvertedHandler } from './events/csv-converted.handler';
import { GetPreviewHandler } from './queries/get-preview.handler';

@Module({
  imports: [
    PdfModule,
    MulterModule.register({
      dest: './uploads',
    }),
    CqrsModule,
  ],
  controllers: [CsvController],
  providers: [
    CsvService,
    ConvertCsvHandler,
    CsvConvertedHandler,
    GetPreviewHandler,
  ],
})
export class CsvModule {}
