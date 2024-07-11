




// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PDFService } from '../pdf/pdf.service';
// import * as fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';
// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

// @Injectable()
// export class FormService {
//   constructor(private readonly pdfService: PDFService) {}

//   async create(data: any, files: { [key: string]: Express.Multer.File[] }) {
//     const chapterData: ChapterData = {
//       chapterName: data.chapterName,
//       location: data.location,
//       memberSize: parseInt(data.memberSize),
//       regionalRank: parseInt(data.regionalRank),
//       allIndiaRank: parseInt(data.allIndiaRank),
//       globalRank: parseInt(data.globalRank),
//       chapterLogo: files['chapterLogo'] && files['chapterLogo'][0] ? files['chapterLogo'][0].path : null,
//       members: []
//     };

//     if (data.members && Array.isArray(data.members)) {
//       for (let i = 0; i < data.members.length; i++) {
//         const member = data.members[i];
//         const memberData: MemberData = {
//           name: member.name,
//           companyName: member.companyName,
//           email: member.email,
//           phone: member.phone,
//           category: member.category,
//           photo: files[`members[${i}][photo]`] && files[`members[${i}][photo]`][0] 
//             ? files[`members[${i}][photo]`][0].path 
//             : null,
//           companyLogo: member.companyLogo || ''
//         };
//         chapterData.members.push(memberData);
//       }
//     }

//     const pdfId = uuidv4();
//     await this.pdfService.generatePDF(chapterData, pdfId);
//     return { pdfId };
//   }

//   async getPDFBuffer(id: string): Promise<Buffer> {
//     const pdfPath = `./uploads/${id}.pdf`;
//     if (!fs.existsSync(pdfPath)) {
//       throw new NotFoundException('PDF not found');
//     }
//     return fs.readFileSync(pdfPath);
//   }
// }



import { Injectable } from '@nestjs/common';
import { PDFService } from '../pdf/pdf.service';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';
import { ChapterDataDto } from './dto/chapter-data.dto';

@Injectable()
export class FormService {
  constructor(private readonly pdfService: PDFService) {}

  async create(data: ChapterDataDto, files: { [key: string]: Express.Multer.File[] }) {
    const chapterData: ChapterData = {
      chapterName: data.chapterName,
      location: data.location,
      memberSize: data.memberSize,
      regionalRank: data.regionalRank,
      allIndiaRank: data.allIndiaRank,
      globalRank: data.globalRank,
      chapterLogo: files['chapterLogo'] && files['chapterLogo'][0] ? files['chapterLogo'][0].path : null,
      members: []
    };

    if (Array.isArray(data.members)) {
      chapterData.members = data.members.map((member, index) => {
        const memberData: MemberData = {
          name: member.name,
          companyName: member.companyName,
          email: member.email,
          phone: member.phone,
          category: member.category,
          photo: files[`members[${index}][photo]`] && files[`members[${index}][photo]`][0] 
            ? files[`members[${index}][photo]`][0].path 
            : null,
          companyLogo: member.companyLogo || ''
        };
        return memberData;
      });
    }

    const pdfId = uuidv4();
    await this.pdfService.generatePDF(chapterData, pdfId);
    return { pdfId };
  }

  async getPDFBuffer(id: string): Promise<Buffer> {
    const pdfPath = `./uploads/${id}.pdf`;
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF not found');
    }
    return fs.readFileSync(pdfPath);
  }
}
