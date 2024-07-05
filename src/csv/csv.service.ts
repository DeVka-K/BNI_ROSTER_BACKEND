import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCsvDto } from './dto/create-csv.dto';
import { PDFService } from '../pdf/pdf.service';
import * as csv from 'csv-parse';
import * as fs from 'fs';
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

@Injectable()
export class CsvService {
  constructor(private readonly pdfService: PDFService) {}

  async create(createCsvDto: CreateCsvDto) {
    const data = await this.parseCsv(createCsvDto.file);
    const pdfBuffer = await this.pdfService.generatePDF(data);
    const pdfPath = `./uploads/${createCsvDto.file.filename}.pdf`;
    fs.writeFileSync(pdfPath, pdfBuffer);
    return { pdfId: createCsvDto.file.filename };
  }

  async getPDFBuffer(id: string): Promise<Buffer> {
    const pdfPath = `./uploads/${id}.pdf`;
    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException('PDF not found');
    }
    return fs.readFileSync(pdfPath);
  }

  private async parseCsv(file: Express.Multer.File): Promise<ChapterData> {
    return new Promise((resolve, reject) => {
      const parser = csv.parse({
        columns: true,
        skip_empty_lines: true,
      });

      const chapterData: ChapterData = {
        chapterName: '',
        location: '',
        memberSize: 0,
        regionalRank: 0,
        allIndiaRank: 0,
        globalRank: 0,
        chapterLogo: '',
        members: [],
      };

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
          if (!chapterData.chapterName) {
            chapterData.chapterName = record.chapterName;
            chapterData.location = record.location;
            chapterData.memberSize = parseInt(record.memberSize);
            chapterData.regionalRank = parseInt(record.regionalRank);
            chapterData.allIndiaRank = parseInt(record.allIndiaRank);
            chapterData.globalRank = parseInt(record.globalRank);
            chapterData.chapterLogo = record.chapterLogo;
          }

          const member: MemberData = {
            name: record.name,
            companyName: record.companyName,
            email: record.email,
            phone: record.phone,
            category: record.category,
            photo: record.photo,
            companyLogo: record.companyLogo,
          };
          chapterData.members.push(member);
        }
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', () => {
        resolve(chapterData);
      });

      parser.write(file.buffer);
      parser.end();
    });
  }
}

