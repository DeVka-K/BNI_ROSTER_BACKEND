



// import { Controller, Post, UseInterceptors, UploadedFiles, Body, Req, Res, Get, Param ,NotFoundException} from '@nestjs/common';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { FormService } from './form.service';
// import { Request, Response } from 'express';
// import { ChapterDataDto } from './dto/chapter-data.dto';

// @Controller('form')
// export class FormController {
//   constructor(private readonly formService: FormService) {}

//   @Post('upload')
//   @UseInterceptors(FileFieldsInterceptor([
//     { name: 'chapterLogo', maxCount: 1 },
//     { name: 'members', maxCount: 10 },
//   ]))
//   async uploadForm(
//     @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
//     @Body() body: ChapterDataDto,
//     @Req() req: Request,
//     @Res() res: Response
//   ) {
//     try {
//       const result = await this.formService.create(body, files);
//       const previewUrl = `${req.protocol}://${req.get('host')}/form/preview/${result.pdfId}`;
//       const downloadUrl = `${req.protocol}://${req.get('host')}/form/download/${result.pdfId}`;
//       res.json({ message: 'Form submitted and processed successfully', pdfId: result.pdfId, previewUrl, downloadUrl });
//     } catch (error) {
//       res.status(500).json({ message: 'An error occurred while processing the form', error: error.message });
//     }
//   }

//   @Get('preview/:id')
//   async previewPDF(@Param('id') id: string, @Res() res: Response) {
//     try {
//       const pdfBuffer = await this.formService.getPDFBuffer(id);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
//       res.send(pdfBuffer);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         res.status(404).json({ message: 'PDF not found' });
//       } else {
//         res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
//       }
//     }
//   }

//   @Get('download/:id')
//   async downloadPDF(@Param('id') id: string, @Res() res: Response) {
//     try {
//       const pdfBuffer = await this.formService.getPDFBuffer(id);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
//       res.send(pdfBuffer);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         res.status(404).json({ message: 'PDF not found' });
//       } else {
//         res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
//       }
//     }
//   }
// }



import { Controller, Post, UseInterceptors, UploadedFiles, Body, Req, Res, Get, Param } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FormService } from './form.service';
import { Request, Response } from 'express';
import { ChapterDataDto } from './dto/chapter-data.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'chapterLogo', maxCount: 1 },
    { name: 'members', maxCount: 10 },
  ]))
  async uploadForm(
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() body: ChapterDataDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const result = await this.formService.create(body, files);
      const previewUrl = `${req.protocol}://${req.get('host')}/form/preview/${result.pdfId}`;
      const downloadUrl = `${req.protocol}://${req.get('host')}/form/download/${result.pdfId}`;
      res.json({ message: 'Form submitted and processed successfully', pdfId: result.pdfId, previewUrl, downloadUrl });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while processing the form', error: error.message });
    }
  }

  @Get('preview/:id')
  async previewPDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.formService.getPDFBuffer(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      if (error.message === 'PDF not found') {
        res.status(404).json({ message: 'PDF not found' });
      } else {
        res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
      }
    }
  }

  @Get('download/:id')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.formService.getPDFBuffer(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      if (error.message === 'PDF not found') {
        res.status(404).json({ message: 'PDF not found' });
      } else {
        res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
      }
    }
  }
}
