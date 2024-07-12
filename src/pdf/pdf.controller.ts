// src/pdf/pdf.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'chapterLogo', maxCount: 1 },
    { name: 'memberPhotos', maxCount: 100 },
    { name: 'companyPhotos', maxCount: 100 },
  ]))
  async generatePdf(
    @Body() generatePdfDto: GeneratePdfDto,
    @UploadedFiles() files: {
      chapterLogo?: Express.Multer.File[],
      memberPhotos?: Express.Multer.File[],
      companyPhotos?: Express.Multer.File[],
    },
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generatePdf(generatePdfDto, {
      chapterLogo: files.chapterLogo?.[0],
      memberPhotos: files.memberPhotos || [],
      companyPhotos: files.companyPhotos || [],
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=chapter.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}