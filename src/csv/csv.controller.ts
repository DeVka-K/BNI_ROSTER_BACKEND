import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { CreateCsvDto } from './dto/create-csv.dto';
import { Response } from 'express';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const createCsvDto = new CreateCsvDto();
    createCsvDto.file = file;
    const result = await this.csvService.create(createCsvDto);
    return { message: 'File uploaded and processed successfully', pdfId: result.pdfId };
  }

  @Get('preview/:id')
  async previewPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.csvService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }

  @Get('download/:id')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.csvService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }
}