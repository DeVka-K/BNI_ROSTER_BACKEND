import { Module } from '@nestjs/common';
import { ExcelToPdfController } from './excel-to-pdf.controller';
import { ExcelToPdfService } from './excel-to-pdf.service';
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  controllers: [ExcelToPdfController],
  providers: [ExcelToPdfService],
})
export class ExcelToPdfModule {}
