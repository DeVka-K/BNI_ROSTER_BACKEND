import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() pdfData: GeneratePdfDto, @Res() res: Response): Promise<void> {
    try {
      // Debugging: log the pdfData object
      console.log('Received pdfData:', pdfData);

      const pdfPath = await this.pdfService.generatePdf(
        pdfData.chapterName,
        pdfData.location,
        pdfData.memberSize,
        pdfData.regionalRank,
        pdfData.allIndiaRank,
        pdfData.globalRank,
        pdfData.members
      );

      res.download(pdfPath, 'bni_roster.pdf', (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          throw new HttpException('Error sending PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          console.log('PDF sent successfully');
          // Optionally, remove the PDF file after sending
          // fs.unlinkSync(pdfPath);
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException('Error generating PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
