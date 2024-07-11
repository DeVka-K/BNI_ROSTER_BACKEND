// import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
// import { ConvertExcelCommand } from './convert-excel.command';
// import { ExcelConvertedEvent } from '../events/excel-converted.event';
// import * as ExcelJS from 'exceljs';
// import { ChapterData, MemberData } from '../../shared/interfaces/chapter-data.interface';

// @CommandHandler(ConvertExcelCommand)
// export class ConvertExcelHandler implements ICommandHandler<ConvertExcelCommand> {
//   constructor(private readonly eventPublisher: EventPublisher) {}

//   async execute(command: ConvertExcelCommand): Promise<void> {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(Buffer.from(command.excelContent, 'base64'));

//     const worksheet = workbook.getWorksheet(1);
//     const chapterData: ChapterData = this.extractChapterData(worksheet);

//     this.eventPublisher.mergeObjectContext(
//       new ExcelConvertedEvent(chapterData)
//     ).commit();
//   }

//   private extractChapterData(worksheet: ExcelJS.Worksheet): ChapterData {
//     // Implement logic to extract chapter data from worksheet
//     // This is a simplified example
//     return {
//       chapterName: worksheet.getCell('A1').value as string,
//       location: worksheet.getCell('A2').value as string,
//       memberSize: worksheet.getCell('A3').value as number,
//       regionalRank: worksheet.getCell('A4').value as number,
//       allIndiaRank: worksheet.getCell('A5').value as number,
//       globalRank: worksheet.getCell('A6').value as number,
//       chapterLogo: worksheet.getCell('A7').value as string,
//       members: this.extractMemberData(worksheet),
//     };
//   }

//   private extractMemberData(worksheet: ExcelJS.Worksheet): MemberData[] {
//     // Implement logic to extract member data from worksheet
//     // This is a simplified example
//     const members: MemberData[] = [];
//     for (let row = 2; row <= worksheet.rowCount; row++) {
//       members.push({
//         name: worksheet.getCell(`B${row}`).value as string,
//         companyName: worksheet.getCell(`C${row}`).value as string,
//         email: worksheet.getCell(`D${row}`).value as string,
//         phone: worksheet.getCell(`E${row}`).value as string,
//         category: worksheet.getCell(`F${row}`).value as string,
//         photo: worksheet.getCell(`G${row}`).value as string,
//         companyLogo: worksheet.getCell(`H${row}`).value as string,
//       });
//     }
//     return members;
//   }
// }




// import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
// import { ConvertExcelCommand } from './convert-excel.command';
// import { ExcelConvertedEvent } from '../events/excel-converted.event';
// import * as xlsx from 'xlsx';
// import { ChapterData, MemberData } from '../../shared/interfaces/chapter-data.interface';
// import { v4 as uuidv4 } from 'uuid';

// @CommandHandler(ConvertExcelCommand)
// export class ConvertExcelHandler implements ICommandHandler<ConvertExcelCommand> {
//   constructor(private readonly eventBus: EventBus) {}

//   async execute(command: ConvertExcelCommand): Promise<void> {
//     const chapterData = this.parseExcel(command.file);
//     const pdfId = uuidv4(); // Generate a new UUID for the PDF
//     this.eventBus.publish(new ExcelConvertedEvent(chapterData, pdfId));
//   }

//   private parseExcel(file: Express.Multer.File): ChapterData {
//     const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//     const chapterData: ChapterData = {
//       chapterName: '',
//       location: '',
//       memberSize: 0,
//       regionalRank: 0,
//       allIndiaRank: 0,
//       globalRank: 0,
//       chapterLogo: '',
//       members: [],
//     };

//     jsonData.forEach((row, index) => {
//       if (index === 0) {
//         chapterData.chapterName = row[0] || '';
//         chapterData.location = row[1] || '';
//         chapterData.memberSize = parseInt(row[2]) || 0;
//         chapterData.regionalRank = parseInt(row[3]) || 0;
//         chapterData.allIndiaRank = parseInt(row[4]) || 0;
//         chapterData.globalRank = parseInt(row[5]) || 0;
//         chapterData.chapterLogo = row[6] || '';
//       } else {
//         const member: MemberData = {
//           name: row[0] || '',
//           companyName: row[1] || '',
//           email: row[2] || '',
//           phone: row[3] || '',
//           category: row[4] || '',
//           photo: row[5] || '',
//           companyLogo: row[6] || '',
//         };
//         chapterData.members.push(member);
//       }
//     });

//     return chapterData;
//   }
// }


import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ConvertExcelCommand } from './convert-excel.command';
import { ExcelConvertedEvent } from '../events/excel-converted.event';
import * as xlsx from 'xlsx';
import { ChapterData, MemberData } from '../../shared/interfaces/chapter-data.interface';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(ConvertExcelCommand)
export class ConvertExcelHandler implements ICommandHandler<ConvertExcelCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: ConvertExcelCommand): Promise<void> {
    const chapterData = this.parseExcel(command.file);
    const pdfId = uuidv4(); // Generate a new UUID for the PDF
    this.eventBus.publish(new ExcelConvertedEvent(chapterData, pdfId));
  }

  private parseExcel(file: Express.Multer.File): ChapterData {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

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

    jsonData.forEach((row: any[], index: number) => {
      if (index === 0) {
        chapterData.chapterName = row[0] || '';
        chapterData.location = row[1] || '';
        chapterData.memberSize = parseInt(row[2]) || 0;
        chapterData.regionalRank = parseInt(row[3]) || 0;
        chapterData.allIndiaRank = parseInt(row[4]) || 0;
        chapterData.globalRank = parseInt(row[5]) || 0;
        chapterData.chapterLogo = row[6] || '';
      } else {
        const member: MemberData = {
          name: row[0] || '',
          companyName: row[1] || '',
          email: row[2] || '',
          phone: row[3] || '',
          category: row[4] || '',
          photo: row[5] || '',
          companyLogo: row[6] || '',
        };
        chapterData.members.push(member);
      }
    });

    return chapterData;
  }
}


