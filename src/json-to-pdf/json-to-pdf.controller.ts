// src/json-to-pdf/json-to-pdf.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JsonToPdfService } from './json-to-pdf.service';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';


@Controller('json-to-pdf')
export class JsonToPdfController {
  constructor(private readonly jsonToPdfService: JsonToPdfService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const jsonData = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    const pdfPath = await this.jsonToPdfService.createPdf(jsonData);
    return res.download(pdfPath);
  }
}
