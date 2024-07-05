// import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
// import { ConvertCsvCommand } from './convert-csv.command';
// import { CsvConvertedEvent } from '../events/csv-converted.event';
// import * as csv from 'csv-parse';
// import { ChapterData, MemberData } from '../../shared/interfaces/chapter-data.interface';

// @CommandHandler(ConvertCsvCommand)
// export class ConvertCsvHandler implements ICommandHandler<ConvertCsvCommand> {
//   constructor(private readonly eventPublisher: EventPublisher) {}

//   async execute(command: ConvertCsvCommand): Promise<void> {
//     const chapterData = await this.parseCsv(command.file);
//     this.eventPublisher.mergeObjectContext(
//       new CsvConvertedEvent(chapterData)
//     ).commit();
//   }

//   private async parseCsv(file: Express.Multer.File): Promise<ChapterData> {
//     return new Promise((resolve, reject) => {
//       const parser = csv.parse({
//         columns: true,
//         skip_empty_lines: true,
//       });

//       const chapterData: ChapterData = {
//         chapterName: '',
//         location: '',
//         memberSize: 0,
//         regionalRank: 0,
//         allIndiaRank: 0,
//         globalRank: 0,
//         chapterLogo: '',
//         members: [],
//       };

//       parser.on('readable', () => {
//         let record;
//         while ((record = parser.read())) {
//           if (!chapterData.chapterName) {
//             chapterData.chapterName = record.chapterName;
//             chapterData.location = record.location;
//             chapterData.memberSize = parseInt(record.memberSize);
//             chapterData.regionalRank = parseInt(record.regionalRank);
//             chapterData.allIndiaRank = parseInt(record.allIndiaRank);
//             chapterData.globalRank = parseInt(record.globalRank);
//             chapterData.chapterLogo = record.chapterLogo;
//           }

//           const member: MemberData = {
//             name: record.name,
//             companyName: record.companyName,
//             email: record.email,
//             phone: record.phone,
//             category: record.category,
//             photo: record.photo,
//             companyLogo: record.companyLogo,
//           };
//           chapterData.members.push(member);
//         }
//       });

//       parser.on('error', (err) => {
//         reject(err);
//       });

//       parser.on('end', () => {
//         resolve(chapterData);
//       });

//       parser.write(file.buffer);
//       parser.end();
//     });
//   }
// }

import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ConvertCsvCommand } from './convert-csv.command';
import { CsvConvertedEvent } from '../events/csv-converted.event';
import * as csv from 'csv-parse';
import { ChapterData, MemberData } from '../../shared/interfaces/chapter-data.interface';

@CommandHandler(ConvertCsvCommand)
export class ConvertCsvHandler implements ICommandHandler<ConvertCsvCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: ConvertCsvCommand): Promise<void> {
    const chapterData = await this.parseCsv(command.file);
    this.eventBus.publish(new CsvConvertedEvent(chapterData));
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
