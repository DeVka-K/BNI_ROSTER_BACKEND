// import { Controller, Post, Body } from '@nestjs/common';
// import { PdfService } from './pdf.service';

// @Controller('pdf')
// export class PdfController {
//   constructor(private readonly pdfService: PdfService) {}

//   @Post('generate')
//   async generatePdf(@Body() data: any) {
//     try {
//       const pdfBase64 = await this.pdfService.generatePdf(data);
//       return { pdf: pdfBase64 };
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       return { error: 'Failed to generate PDF' };
//     }
//   }
// }



// import { Controller, Post, Body, Res } from '@nestjs/common';
// import { Response } from 'express';
// import { PdfService } from './pdf.service';

// @Controller('pdf')
// export class PdfController {
//   constructor(private readonly pdfService: PdfService) {}

//   @Post('preview')
//   async generatePreview(@Body() data: any) {
//     try {
//       const previewHtml = await this.pdfService.generatePreview(data);
//       return { preview: previewHtml };
//     } catch (error) {
//       console.error('Error generating preview:', error);
//       return { error: 'Failed to generate preview' };
//     }
//   }

//   @Post('generate')
//   async generatePdf(@Body() data: any, @Res() res: Response) {
//     try {
//       const pdfBuffer = await this.pdfService.generatePdf(data);
      
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', 'attachment; filename=bni_roster.pdf');
//       res.send(pdfBuffer);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       res.status(500).json({ error: 'Failed to generate PDF' });
//     }
//   }
// }

import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() data: any, @Res() res: Response) {
    try {
      const pdfStream = await this.pdfService.generatePdf(data);

      res.setHeader('Content-Type', 'application/pdf');
      pdfStream.pipe(res);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}