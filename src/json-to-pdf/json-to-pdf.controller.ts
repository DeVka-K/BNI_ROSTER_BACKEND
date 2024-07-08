import { Controller, Post, UploadedFile, UseInterceptors, Res, Get, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { JsonToPdfService } from './json-to-pdf.service';

const PDFS_BASE_PATH = process.env.PDFS_BASE_PATH || path.resolve(__dirname, '../../../pdfs');

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
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
    try {
      console.log('File received:', file);
      let jsonData;
      try {
        jsonData = JSON.parse(fs.readFileSync(file.path, 'utf8'));
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
      console.log('Parsed JSON data:', jsonData);
      const pdfFilename = await this.jsonToPdfService.createPdf(jsonData);
      console.log('PDF created:', pdfFilename);
      const previewUrl = `${req.protocol}://${req.get('host')}/api/json-to-pdf/preview/${pdfFilename}`;
      const downloadUrl = `${req.protocol}://${req.get('host')}/api/json-to-pdf/download/${pdfFilename}`;
      console.log('Response URLs:', { previewUrl, downloadUrl });
      return res.json({ 
        message: 'PDF created successfully',
        previewUrl,
        downloadUrl
      });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }
  
  @Get('preview/:filename')
  async previewFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(PDFS_BASE_PATH, filename);
      if (fs.existsSync(filePath)) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PDF Preview</title>
            <style>
              body { margin: 0; padding: 0; height: 100vh; display: flex; flex-direction: column; }
              #back-button { position: fixed; top: 10px; left: 10px; z-index: 1000; }
              #pdf-viewer { flex-grow: 1; border: none; }
            </style>
          </head>
          <body>
            <button id="back-button" onclick="window.close()">Back</button>
            <iframe id="pdf-viewer" src="/api/json-to-pdf/raw/${filename}" width="100%" height="100%"></iframe>
          </body>
          </html>
        `;
        res.send(htmlContent);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } catch (error) {
      console.error('Error in previewFile:', error);
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }

  @Get('raw/:filename')
  async getRawPdf(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(PDFS_BASE_PATH, filename);
      if (fs.existsSync(filePath)) {
        res.contentType('application/pdf');
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } catch (error) {
      console.error('Error in getRawPdf:', error);
      res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(PDFS_BASE_PATH, filename);
      if (fs.existsSync(filePath)) {
        res.download(filePath);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
      }
    } catch (error) {
      console.error('Error in downloadFile:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Internal server error: ${error.message}` });
    }
  }
}