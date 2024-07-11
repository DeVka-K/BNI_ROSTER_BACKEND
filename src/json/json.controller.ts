import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JsonService } from './json.service';
import { CreateJsonDto } from './dto/create-json.dto';
import { Response, Request } from 'express';
import * as multer from 'multer';

@Controller('json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new HttpException('No file uploaded or file buffer is empty', HttpStatus.BAD_REQUEST);
    }
    const createJsonDto = new CreateJsonDto();
    createJsonDto.file = file;
    const result = await this.jsonService.create(createJsonDto);

    const previewUrl = `${req.protocol}://${req.get('host')}/json/preview/${result.pdfId}`;
    const downloadUrl = `${req.protocol}://${req.get('host')}/json/download/${result.pdfId}`;

    return {
      message: 'File uploaded and processed successfully',
      pdfId: result.pdfId,
      previewUrl: previewUrl,
      downloadUrl: downloadUrl
    };
  }

  @Get('preview/:id')
  async previewPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.jsonService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }

  @Get('download/:id')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.jsonService.getPDFBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
    res.send(pdfBuffer);
  }
}
