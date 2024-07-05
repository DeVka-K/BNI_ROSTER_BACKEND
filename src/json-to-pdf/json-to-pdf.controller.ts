import { Controller, Post, UploadedFile, UseInterceptors, Res, Get, Param, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { JsonToPdfService } from './json-to-pdf.service';

@Controller('json-to-pdf')
export class JsonToPdfController {
  constructor(private readonly jsonToPdfService: JsonToPdfService) {}

  @Post('upload') // <-- Ensure this path matches the route you're accessing in Postman
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
    try {
      console.log('File received:', file);
      const jsonData = JSON.parse(fs.readFileSync(file.path, 'utf8'));
      console.log('Parsed JSON data:', jsonData);
      const pdfFilename = await this.jsonToPdfService.createPdf(jsonData);
      console.log('PDF created:', pdfFilename);
      const previewUrl = `${req.protocol}://${req.get('host')}/api/json-to-pdf/preview/${pdfFilename}`;
      const downloadUrl = `${req.protocol}://${req.get('host')}/api/json-to-pdf/download/${pdfFilename}`;
      return res.json({ message: 'PDF created successfully', previewUrl, downloadUrl });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }
  
  @Get('preview/:filename')
  async previewFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../../pdfs', filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../../pdfs', filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  }
}

