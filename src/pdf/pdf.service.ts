// import { Injectable } from '@nestjs/common';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';


// @Injectable()
// export class PDFService {
//   async generatePDF(data: ChapterData): Promise<Buffer> {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();
//     const { width, height } = page.getSize();
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Add chapter details
//     page.drawText(`Chapter: ${data.chapterName}`, { x: 50, y: height - 50, font, size: 18 });
//     page.drawText(`Location: ${data.location}`, { x: 50, y: height - 80, font, size: 12 });
//     page.drawText(`Member Size: ${data.memberSize}`, { x: 50, y: height - 100, font, size: 12 });
//     page.drawText(`Regional Rank: ${data.regionalRank}`, { x: 50, y: height - 120, font, size: 12 });
//     page.drawText(`All India Rank: ${data.allIndiaRank}`, { x: 50, y: height - 140, font, size: 12 });
//     page.drawText(`Global Rank: ${data.globalRank}`, { x: 50, y: height - 160, font, size: 12 });

//     // Add chapter logo
//     if (data.chapterLogo) {
//       const logoImage = await pdfDoc.embedPng(data.chapterLogo);
//       page.drawImage(logoImage, { x: width - 100, y: height - 100, width: 80, height: 80 });
//     }

//     // Add member details
//     let yOffset = height - 200;
//     for (const member of data.members) {
//       await this.addMemberToPDF(pdfDoc, page, member, yOffset, font);
//       yOffset -= 100;
//       if (yOffset < 50) {
//         page = pdfDoc.addPage();
//         yOffset = height - 50;
//       }
//     }

//     return pdfDoc.save();
//   }

//   private async addMemberToPDF(pdfDoc: PDFDocument, page: PDFPage, member: MemberData, yOffset: number, font: PDFFont) {
//     page.drawText(`Name: ${member.name}`, { x: 50, y: yOffset, font, size: 12 });
//     page.drawText(`Company: ${member.companyName}`, { x: 50, y: yOffset - 20, font, size: 12 });
//     page.drawText(`Email: ${member.email}`, { x: 50, y: yOffset - 40, font, size: 12 });
//     page.drawText(`Phone: ${member.phone}`, { x: 50, y: yOffset - 60, font, size: 12 });
//     page.drawText(`Category: ${member.category}`, { x: 50, y: yOffset - 80, font, size: 12 });

//     // Add member photo and company logo if available
//     if (member.photo) {
//       const photoImage = await pdfDoc.embedJpg(Buffer.from(member.photo, 'base64'));
//       page.drawImage(photoImage, { x: 300, y: yOffset - 60, width: 60, height: 60 });
//     }
//     if (member.companyLogo) {
//       const logoImage = await pdfDoc.embedPng(Buffer.from(member.companyLogo, 'base64'));
//       page.drawImage(logoImage, { x: 400, y: yOffset - 60, width: 60, height: 60 });
//     }
//   }
// }


// import { Injectable } from '@nestjs/common';
// import { PDFDocument, rgb } from 'pdfkit'; // Import necessary classes
// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

// @Injectable()
// export class PDFService {
//   async generatePDF(data: ChapterData): Promise<Buffer> {
//     const doc = new PDFDocument(); // Create a PDFDocument instance
//     const { width, height } = doc.pageSize; // Get page size

//     // Add chapter details
//     doc.fontSize(18); // Set font size
//     doc.text(`Chapter: ${data.chapterName}`, 50, height - 50); // Add chapter name

//     doc.fontSize(12); // Set font size for other details
//     doc.text(`Location: ${data.location}`, 50, height - 80);
//     doc.text(`Member Size: ${data.memberSize}`, 50, height - 100);
//     doc.text(`Regional Rank: ${data.regionalRank}`, 50, height - 120);
//     doc.text(`All India Rank: ${data.allIndiaRank}`, 50, height - 140);
//     doc.text(`Global Rank: ${data.globalRank}`, 50, height - 160);

//     // Add chapter logo (if available)
//     if (data.chapterLogo) {
//       const logoImage = doc.image(data.chapterLogo, width - 100, height - 100, { width: 80, height: 80 }); // Add image
//       if (!logoImage) {
//         console.warn('Error adding chapter logo:', data.chapterLogo); // Handle potential errors
//       }
//     }

//     // Add member details
//     let yOffset = height - 200;
//     for (const member of data.members) {
//       this.addMemberToPDF(doc, yOffset, member); // Call helper function
//       yOffset -= 100;

//       if (yOffset < 50) {
//         doc.addPage(); // Add new page if content overflows
//         yOffset = height - 50;
//       }
//     }

//     const buffer = await doc.pipe(new Promise((resolve) => resolve())).promise(); // Create a promise and resolve with buffer
//     doc.end(); // Close the document stream

//     return buffer;
//   }


//   private addMemberToPDF(doc: PDFDocument, yOffset: number, member: MemberData) {
//     doc.fontSize(12); // Set font size for member details

//     doc.text(`Name: ${member.name}`, 50, yOffset);
//     doc.text(`Company: ${member.companyName}`, 50, yOffset - 20);
//     doc.text(`Email: ${member.email}`, 50, yOffset - 40);
//     doc.text(`Phone: ${member.phone}`, 50, yOffset - 60);
//     doc.text(`Category: ${member.category}`, 50, yOffset - 80);

//     // Add member photo and company logo (if available)
//     if (member.photo) {
//       const photoImage = doc.image(member.photo, 300, yOffset - 60, { width: 60, height: 60 }); // Add image
//       if (!photoImage) {
//         console.warn('Error adding member photo:', member.photo); // Handle potential errors
//       }
//     }
//     if (member.companyLogo) {
//       const logoImage = doc.image(member.companyLogo, 400, yOffset - 60, { width: 60, height: 60 }); // Add image
//       if (!logoImage) {
//         console.warn('Error adding company logo:', member.companyLogo); // Handle potential errors
//       }
//     }
//   }
// }
// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import PDFDocument from 'pdfkit';
// import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

// @Injectable()
// export class PDFService {
//   async generatePDF(data: ChapterData): Promise<string> {
//     const pdfPath = path.join(__dirname, 'example.pdf');
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(pdfPath);

//     doc.pipe(stream);

//     // Add chapter details
//     doc.fontSize(18).text(`Chapter: ${data.chapterName}`, 50, 50);
//     doc.fontSize(12).text(`Location: ${data.location}`, 50, 80);
//     doc.fontSize(12).text(`Member Size: ${data.memberSize}`, 50, 100);
//     doc.fontSize(12).text(`Regional Rank: ${data.regionalRank}`, 50, 120);
//     doc.fontSize(12).text(`All India Rank: ${data.allIndiaRank}`, 50, 140);
//     doc.fontSize(12).text(`Global Rank: ${data.globalRank}`, 50, 160);

//     // Add chapter logo
//     if (data.chapterLogo) {
//       const logoPath = path.join(__dirname, data.chapterLogo);
//       console.log(`Processing chapter logo: ${logoPath}`);
//       if (fs.existsSync(logoPath)) {
//         doc.image(logoPath, doc.page.width - 100, 50, { width: 80, height: 80 });
//       } else {
//         console.warn(`Chapter logo not found at path: ${logoPath}`);
//       }
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
//       const photoPath = path.join(__dirname, member.photo);
//       console.log(`Processing member photo: ${photoPath}`);
//       if (fs.existsSync(photoPath)) {
//         doc.image(photoPath, 300, yOffset + 60, { width: 60, height: 60 });
//       } else {
//         console.warn(`Photo not found at path: ${photoPath}`);
//       }
//     }
//     if (member.companyLogo) {
//       const logoPath = path.join(__dirname, member.companyLogo);
//       console.log(`Processing company logo: ${logoPath}`);
//       if (fs.existsSync(logoPath)) {
//         doc.image(logoPath, 400, yOffset + 60, { width: 60, height: 60 });
//       } else {
//         console.warn(`Company logo not found at path: ${logoPath}`);
//       }
//     }
//   }
// }


import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';

@Injectable()
export class PDFService {
  async generatePDF(data: ChapterData): Promise<string> {
    const pdfPath = path.join(__dirname, '../../uploads/example.pdf');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Add chapter details
    doc.fontSize(18).text(`Chapter: ${data.chapterName}`, 50, 50);
    doc.fontSize(12).text(`Location: ${data.location}`, 50, 80);
    doc.fontSize(12).text(`Member Size: ${data.memberSize}`, 50, 100);
    doc.fontSize(12).text(`Regional Rank: ${data.regionalRank}`, 50, 120);
    doc.fontSize(12).text(`All India Rank: ${data.allIndiaRank}`, 50, 140);
    doc.fontSize(12).text(`Global Rank: ${data.globalRank}`, 50, 160);

    // Add chapter logo if available
    if (data.chapterLogo) {
      const logoPath = path.join(__dirname, '../../uploads/images', data.chapterLogo);
      console.log(`Processing chapter logo: ${logoPath}`);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.width - 100, 50, { width: 80, height: 80 });
      } else {
        console.warn(`Chapter logo not found at path: ${logoPath}`);
      }
    }

    // Add member details
    let yOffset = 200;
    for (const member of data.members) {
      this.addMemberToPDF(doc, member, yOffset);
      yOffset += 100;
      if (yOffset > doc.page.height - 50) {
        doc.addPage();
        yOffset = 50;
      }
    }

    doc.end();

    return pdfPath;
  }

  private addMemberToPDF(doc: PDFDocument, member: MemberData, yOffset: number) {
    doc.fontSize(12).text(`Name: ${member.name}`, 50, yOffset);
    doc.fontSize(12).text(`Company: ${member.companyName}`, 50, yOffset + 20);
    doc.fontSize(12).text(`Email: ${member.email}`, 50, yOffset + 40);
    doc.fontSize(12).text(`Phone: ${member.phone}`, 50, yOffset + 60);
    doc.fontSize(12).text(`Category: ${member.category}`, 50, yOffset + 80);

    // Add member photo if available
    if (member.photo) {
      const photoPath = path.join(__dirname, '../../uploads/images', member.photo);
      console.log(`Processing member photo: ${photoPath}`);
      if (fs.existsSync(photoPath)) {
        doc.image(photoPath, 300, yOffset + 60, { width: 60, height: 60 });
      } else {
        console.warn(`Photo not found at path: ${photoPath}`);
      }
    }

    // Add company logo if available
    if (member.companyLogo) {
      const logoPath = path.join(__dirname, '../../uploads/images', member.companyLogo);
      console.log(`Processing company logo: ${logoPath}`);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 400, yOffset + 60, { width: 60, height: 60 });
      } else {
        console.warn(`Company logo not found at path: ${logoPath}`);
      }
    }
  }
}



