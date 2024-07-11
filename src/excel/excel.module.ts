// import { Module } from '@nestjs/common';
// import { ExcelController } from './excel.controller';
// import { ExcelService } from './excel.service';
// import { PdfModule  } from '../pdf/pdf.module';
// import { MulterModule } from '@nestjs/platform-express';

// @Module({
//   imports: [
//     PdfModule ,
//     MulterModule.register({
//       dest: './uploads',
//     }),
//   ],
//   controllers: [ExcelController],
//   providers: [ExcelService],
// })
// export class ExcelModule {}


import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { PdfModule } from '../pdf/pdf.module';
import { MulterModule } from '@nestjs/platform-express';
import { CqrsModule } from '@nestjs/cqrs';
import { ConvertExcelHandler } from './commands/convert-excel.handler';
import { ExcelConvertedHandler } from './events/excel-converted.handler';
import { GetPreviewHandler } from './queries/get-preview.handler'

@Module({
  imports: [
    PdfModule,
    MulterModule.register({
      dest: './uploads',
    }),
    CqrsModule,
  ],
  controllers: [ExcelController],
  providers: [
    ExcelService,
    ConvertExcelHandler,
    ExcelConvertedHandler,
    GetPreviewHandler,
  ],
})
export class ExcelModule {}
