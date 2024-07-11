import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJsonDto } from './dto/create-json.dto';
import { PDFService } from '../pdf/pdf.service';
import * as fs from 'fs';
import { ChapterData } from '../shared/interfaces/chapter-data.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JsonService {
  constructor(private readonly pdfService: PDFService) {}

  async create(createJsonDto: CreateJsonDto) {
    const data = this.parseJson(createJsonDto.file);
    const pdfId = uuidv4();
    await this.pdfService.generatePDF(data, pdfId);
    return { pdfId };
  }

  async getPDFBuffer(id: string): Promise<Buffer> {
    const pdfPath = `./uploads/${id}.pdf`;
    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException('PDF not found');
    }
    return fs.readFileSync(pdfPath);
  }

  private parseJson(file: Express.Multer.File): ChapterData {
    const jsonData = JSON.parse(file.buffer.toString());
    
    // Ensure jsonData conforms to ChapterData structure
    const chapterData: ChapterData = {
      chapterName: jsonData.chapterName || '',
      location: jsonData.location || '',
      memberSize: jsonData.memberSize || 0,
      regionalRank: jsonData.regionalRank || 0,
      allIndiaRank: jsonData.allIndiaRank || 0,
      globalRank: jsonData.globalRank || 0,
      chapterLogo: jsonData.chapterLogo || '',
      members: jsonData.members || [],
    };

    return chapterData;
  }
}
