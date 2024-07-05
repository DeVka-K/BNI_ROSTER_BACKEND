import { Module } from '@nestjs/common';
import { ExcelToPdfController } from './excel-to-pdf.controller';
import { ExcelToPdfService } from './excel-to-pdf.service';

@Module({
  controllers: [ExcelToPdfController],
  providers: [ExcelToPdfService],
})
export class ExcelToPdfModule {}
