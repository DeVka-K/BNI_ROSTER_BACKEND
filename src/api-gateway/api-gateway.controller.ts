import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ConvertExcelToPdfDto } from '../excel-to-pdf/dto/convert-excel-to-pdf.dto';

@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('convert')
  async convertExcelToPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
    return this.apiGatewayService.convertExcelToPdf(convertExcelToPdfDto);
  }

  @Get('preview')
  async previewPdf(@Body() convertExcelToPdfDto: ConvertExcelToPdfDto) {
    return this.apiGatewayService.previewPdf(convertExcelToPdfDto);
  }
}
