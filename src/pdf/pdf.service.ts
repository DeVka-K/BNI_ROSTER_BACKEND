

// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as PDFDocument from 'pdfkit';

// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

// @Injectable()
// export class PDFService {
//   async generatePDF(data: ChapterData): Promise<string> {
//     const pdfPath = path.join(__dirname, '..', '..', 'uploads', 'example.pdf');
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(pdfPath);

//     doc.pipe(stream);

//     console.log(`Creating PDF at ${pdfPath}`);

//     // Add chapter details
//     doc.fontSize(18).text(`Chapter: ${data.chapterName}`, 50, 50);
//     doc.fontSize(12).text(`Location: ${data.location}`, 50, 80);
//     doc.fontSize(12).text(`Member Size: ${data.memberSize}`, 50, 100);
//     doc.fontSize(12).text(`Regional Rank: ${data.regionalRank}`, 50, 120);
//     doc.fontSize(12).text(`All India Rank: ${data.allIndiaRank}`, 50, 140);
//     doc.fontSize(12).text(`Global Rank: ${data.globalRank}`, 50, 160);

//     // Add chapter logo
//     if (data.chapterLogo) {
//       const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', data.chapterLogo);
//       doc.image(logoPath, doc.page.width - 100, 50, { width: 80, height: 80 });
//       console.log(`Adding chapter logo from ${logoPath}`);
//     }

//     // Add member details
//     let yOffset = 200;
//     for (const member of data.members) {
//       this.addMemberToPDF(doc, member, yOffset);
//       yOffset += 100;
//       if (yOffset > doc.page.height - 50) {
//         doc.addPage();
//         yOffset = 50;
//       }
//     }

//     doc.end();

//     return pdfPath;
//   }

//   private addMemberToPDF(doc: PDFDocument, member: MemberData, yOffset: number) {
//     doc.fontSize(12).text(`Name: ${member.name}`, 50, yOffset);
//     doc.fontSize(12).text(`Company: ${member.companyName}`, 50, yOffset + 20);
//     doc.fontSize(12).text(`Email: ${member.email}`, 50, yOffset + 40);
//     doc.fontSize(12).text(`Phone: ${member.phone}`, 50, yOffset + 60);
//     doc.fontSize(12).text(`Category: ${member.category}`, 50, yOffset + 80);

//     // Add member photo and company logo if available
//     if (member.photo) {
//       const photoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.photo);
//       doc.image(photoPath, 300, yOffset + 60, { width: 60, height: 60 });
//       console.log(`Adding member photo from ${photoPath}`);
//     }
//     if (member.companyLogo) {
//       const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.companyLogo);
//       doc.image(logoPath, 400, yOffset + 60, { width: 60, height: 60 });
//       console.log(`Adding member company logo from ${logoPath}`);
//     }
//   }
// }

// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as PDFDocument from 'pdfkit';

// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

// @Injectable()
// export class PDFService {
//   async generatePDF(data: ChapterData, pdfId: string): Promise<string> {
//     const pdfPath = path.join(__dirname, '..', '..', 'uploads', `${pdfId}.pdf`);
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(pdfPath);

//     doc.pipe(stream);

//     console.log(`Creating PDF at ${pdfPath}`);

//     // Add chapter details on the first page
//     doc.fontSize(18).text(`Chapter: ${data.chapterName}`, 50, 50);
//     doc.fontSize(12).text(`Location: ${data.location}`, 50, 80);
//     doc.fontSize(12).text(`Member Size: ${data.memberSize}`, 50, 100);
//     doc.fontSize(12).text(`Regional Rank: ${data.regionalRank}`, 50, 120);
//     doc.fontSize(12).text(`All India Rank: ${data.allIndiaRank}`, 50, 140);
//     doc.fontSize(12).text(`Global Rank: ${data.globalRank}`, 50, 160);

//     // Add chapter logo
//     if (data.chapterLogo) {
//       const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', data.chapterLogo);
//       doc.image(logoPath, doc.page.width - 100, 50, { width: 80, height: 80 });
//       console.log(`Adding chapter logo from ${logoPath}`);
//     }

//     // Add member details starting from the second page
//     let yOffset = 50;
//     doc.addPage();
//     for (let i = 0; i < data.members.length; i++) {
//       this.addMemberToPDF(doc, data.members[i], yOffset);
//       yOffset += 100;
//       if ((i + 1) % 7 === 0 && i !== data.members.length - 1) {
//         doc.addPage();
//         yOffset = 50;
//       }
//     }

//     doc.end();

//     return pdfPath;
//   }

//   private addMemberToPDF(doc: PDFDocument, member: MemberData, yOffset: number) {
//     const margin = 10;
//     const startX = 50;
//     const startY = yOffset;

//     // Add member details
//     doc.fontSize(12).text(`Name: ${member.name}`, startX, startY);
//     doc.fontSize(12).text(`Company: ${member.companyName}`, startX, startY + 20);
//     doc.fontSize(12).text(`Email: ${member.email}`, startX, startY + 40);
//     doc.fontSize(12).text(`Phone: ${member.phone}`, startX, startY + 60);
//     doc.fontSize(12).text(`Category: ${member.category}`, startX, startY + 80);

//     // Add member photo and company logo if available
//     if (member.photo) {
//       const photoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.photo);
//       doc.image(photoPath, 300, startY, { width: 60, height: 60 });
//       console.log(`Adding member photo from ${photoPath}`);
//     }
//     if (member.companyLogo) {
//       const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.companyLogo);
//       doc.image(logoPath, 400, startY, { width: 60, height: 60 });
//       console.log(`Adding member company logo from ${logoPath}`);
//     }
//   }
// }



import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
 
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';
 
@Injectable()
export class PDFService {
  async generatePDF(data: ChapterData, pdfId: string): Promise<string> {
    const pdfPath = path.join(__dirname, '..', '..', 'uploads', `${pdfId}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
 
    doc.pipe(stream);
 
    console.log(`Creating PDF at ${pdfPath}`);
 
    // Add chapter details on the first page
    doc.fontSize(18).text(`Chapter: ${data.chapterName}`, 50, 50);
    doc.fontSize(12).text(`Location: ${data.location}`, 50, 80);
    doc.fontSize(12).text(`Member Size: ${data.memberSize}`, 50, 100);
    doc.fontSize(12).text(`Regional Rank: ${data.regionalRank}`, 50, 120);
    doc.fontSize(12).text(`All India Rank: ${data.allIndiaRank}`, 50, 140);
    doc.fontSize(12).text(`Global Rank: ${data.globalRank}`, 50, 160);
 
    // Add chapter logo
    if (data.chapterLogo) {
      const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', data.chapterLogo);
      doc.image(logoPath, doc.page.width - 100, 50, { width: 80, height: 80 });
      console.log(`Adding chapter logo from ${logoPath}`);
    }
 
    // Add member details starting from the second page
    let yOffset = 50;
    doc.addPage();
    for (let i = 0; i < data.members.length; i++) {
      this.addMemberToPDF(doc, data.members[i], yOffset);
      yOffset += 100;
      if ((i + 1) % 7 === 0 && i !== data.members.length - 1) {
        doc.addPage();
        yOffset = 50;
      }
    }
 
    doc.end();
 
    return pdfPath;
  }
 
  private addMemberToPDF(doc: PDFDocument, member: MemberData, yOffset: number) {
    const margin = 10;
    const startX = 50;
    const startY = yOffset;
 
    // Add member details
    doc.fontSize(12).text(`Name: ${member.name}`, startX, startY);
    doc.fontSize(12).text(`Company: ${member.companyName}`, startX, startY + 20);
    doc.fontSize(12).text(`Email: ${member.email}`, startX, startY + 40);
    doc.fontSize(12).text(`Phone: ${member.phone}`, startX, startY + 60);
    doc.fontSize(12).text(`Category: ${member.category}`, startX, startY + 80);
 
    // Add member photo and company logo if available
    if (member.photo) {
      const photoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.photo);
      doc.image(photoPath, 300, startY, { width: 60, height: 60 });
      console.log(`Adding member photo from ${photoPath}`);
    }
    if (member.companyLogo) {
      const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.companyLogo);
      doc.image(logoPath, 400, startY, { width: 60, height: 60 });
      console.log(`Adding member company logo from ${logoPath}`);
    }
  }
}
 





