// import { Injectable } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import { ConvertExcelCommand } from './commands/convert-excel.command';
// import { CreateExcelDto } from './dto/create-excel.dto';

// @Injectable()
// export class ExcelService {
//   constructor(private readonly commandBus: CommandBus) {}

//   async create(createExcelDto: CreateExcelDto): Promise<void> {
//     await this.commandBus.execute(new ConvertExcelCommand(createExcelDto.excelContent));
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { PDFService } from '../pdf/pdf.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExcelService {
  constructor(private readonly pdfService: PDFService) {}

  async create(createExcelDto: CreateExcelDto) {
    const data = await this.parseExcel(createExcelDto.file);
    const pdfId = uuidv4();
    const status="isexcel";
    console.log("excel status",status);
    
    await this.pdfService.generatePDF(data, pdfId,status);
    return { pdfId };
  }

  async getPDFBuffer(id: string): Promise<Buffer> {
    const pdfPath = `./uploads/${id}.pdf`;
    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException('PDF not found');
    }
    return fs.readFileSync(pdfPath);
  }

  private async parseExcel(file: Express.Multer.File): Promise<ChapterData> {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

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

        jsonData.forEach((record: any, index: number) => {
          if (index === 0) {
            chapterData.chapterName = record.chapterName || '';
            chapterData.location = record.location || '';
            chapterData.memberSize = parseInt(record.memberSize) || 0;
            chapterData.regionalRank = parseInt(record.regionalRank) || 0;
            chapterData.allIndiaRank = parseInt(record.allIndiaRank) || 0;
            chapterData.globalRank = parseInt(record.globalRank) || 0;
            chapterData.chapterLogo = record.chapterLogo || '';
          } else {
            const member: MemberData = {
              name: record.name || '',
              companyName: record.companyName || '',
              email: record.email || '',
              phone: record.phone || '',
              category: record.category || '',
              photo: record.photo || '',
              companyLogo: record.companyLogo || '',
            };
            chapterData.members.push(member);
          }
        });

        resolve(chapterData);
      } catch (error) {
        reject(error);
      }
    });
  }
}
