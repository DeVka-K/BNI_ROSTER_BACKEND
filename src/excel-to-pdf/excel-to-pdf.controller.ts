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

import { Controller, Post, UploadedFile, UseInterceptors, Res, Get, Param, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { ExcelToPdfService } from './excel-to-pdf.service';

@Controller('excel-to-pdf')
export class ExcelToPdfController {
  private readonly logger = new Logger(ExcelToPdfController.name);

  constructor(private readonly excelToPdfService: ExcelToPdfService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        return cb(new Error('Only Excel files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);
      this.logger.log(`File saved at: ${file.path}`);

      const pdfFilename = await this.excelToPdfService.createPdf(file.path);
      this.logger.log(`PDF created: ${pdfFilename}`);

      // Clean up the uploaded Excel file
      fs.unlinkSync(file.path);

      const previewUrl = `${req.protocol}://${req.get('host')}/api/excel-to-pdf/preview/${pdfFilename}`;
      const downloadUrl = `${req.protocol}://${req.get('host')}/api/excel-to-pdf/download/${pdfFilename}`;
      
      return res.json({
        message: 'PDF created successfully',
        previewUrl,
        downloadUrl
      });
    } catch (error) {
      this.logger.error('Error in uploadFile:', error);
      throw new HttpException(`Error processing file: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('preview/:filename')
  async previewFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(process.cwd(), 'pdfs', filename);
      if (fs.existsSync(filePath)) {
        res.contentType('application/pdf');
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
      }
    } catch (error) {
      console.error('Error in previewFile:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error previewing file: ${error.message}` });
    }
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(process.cwd(), 'pdfs', filename);
      if (fs.existsSync(filePath)) {
        res.download(filePath);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
      }
    } catch (error) {
      this.logger.error('Error in uploadFile:', error);
      throw new HttpException(`Error processing file: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}