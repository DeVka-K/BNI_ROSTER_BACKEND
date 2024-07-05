// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { ExcelToPdfService } from './excel-to-pdf.service';
// import { ConvertExcelToPdfDto } from './dto/convert-excel-to-pdf.dto';

// @Controller('excel-to-pdf')
// export class ExcelToPdfController {
//   constructor(private readonly excelToPdfService: ExcelToPdfService) {}

//   @Post('convert')
//   async convertExcelToPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
//     return this.excelToPdfService.convertExcelToPdf(convertExcelToPdfDto);
//   }

//   @Get('preview')
//   async previewPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
//     return this.excelToPdfService.previewPdf(convertExcelToPdfDto);
//   }
// }

import { Controller, Post, Body } from '@nestjs/common';
import { ExcelToPdfService } from './excel-to-pdf.service';
import { ConvertExcelToPdfDto } from './dto/convert-excel-to-pdf.dto';


@Controller('excel-to-pdf')
export class ExcelToPdfController {
  constructor(private readonly excelToPdfService: ExcelToPdfService) {}

  @Post('convert')
  async convertExcelToPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
    const pdfBuffer = await this.excelToPdfService.convertExcelToPdf(convertExcelToPdfDto);
    return pdfBuffer;
  }

  @Post('preview')
  async previewPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
    const previewBuffer = await this.excelToPdfService.previewPdf(convertExcelToPdfDto);
    return previewBuffer;
  }
}

