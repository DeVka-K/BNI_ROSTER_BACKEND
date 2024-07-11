// import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ExcelService } from './excel.service';
// import { CreateExcelDto } from './dto/create-excel.dto';
// import { Response } from 'express';

// @Controller('excel')
// export class ExcelController {
//   constructor(private readonly excelService: ExcelService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     const createExcelDto = new CreateExcelDto();
//     createExcelDto.file = file;
//     const pdfBuffer = await this.excelService.create(createExcelDto);
//     return { message: 'File uploaded and processed successfully', pdfId: file.filename };
//   }

//   @Get('preview/:id')
//   async previewPDF(@Param('id') id: string, @Res() res: Response) {
//     const pdfBuffer = await this.excelService.getPDFBuffer(id);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
//     res.send(pdfBuffer);
//   }

//   @Get('download/:id')
//   async downloadPDF(@Param('id') id: string, @Res() res: Response) {
//     const pdfBuffer = await this.excelService.getPDFBuffer(id);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
//     res.send(pdfBuffer);
//   }
// }



import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { CreateExcelDto } from './dto/create-excel.dto';
import { Response, Request } from 'express';
import * as multer from 'multer';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new HttpException('No file uploaded or file buffer is empty', HttpStatus.BAD_REQUEST);
    }
    const createExcelDto = new CreateExcelDto();
    createExcelDto.file = file;
    const result = await this.excelService.create(createExcelDto);

    // Construct URLs dynamically
    const previewUrl = `${req.protocol}://${req.get('host')}/excel/preview/${result.pdfId}`;
    const downloadUrl = `${req.protocol}://${req.get('host')}/excel/download/${result.pdfId}`;

    return {
      message: 'File uploaded and processed successfully',
      pdfId: result.pdfId,
      previewUrl: previewUrl,
      downloadUrl: downloadUrl
    };
  }

  @Get('preview/:id')
  async previewPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.excelService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }

  @Get('download/:id')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.excelService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }
}
