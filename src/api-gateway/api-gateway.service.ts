import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConvertExcelToPdfDto } from '../excel-to-pdf/dto/convert-excel-to-pdf.dto';

@Injectable()
export class ApiGatewayService {
  async convertExcelToPdf(convertExcelToPdfDto: ConvertExcelToPdfDto) {
    const response = await axios.post<Buffer>('http://excel-to-pdf-service:3000/excel-to-pdf/convert', convertExcelToPdfDto);
    return response.data;
  }

  async previewPdf(convertExcelToPdfDto: ConvertExcelToPdfDto) {
    const response = await axios.get<Buffer>('http://excel-to-pdf-service:3000/excel-to-pdf/preview', { params: convertExcelToPdfDto });
    return response.data;
  }
}
