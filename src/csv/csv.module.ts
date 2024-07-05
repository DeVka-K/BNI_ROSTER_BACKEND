import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { PdfModule } from '../pdf/pdf.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PdfModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}

