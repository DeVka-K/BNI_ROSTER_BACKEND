// import { Injectable } from '@nestjs/common';
// import * as PDFDocument from 'pdfkit';

// @Injectable()
// export class PdfService {
//   async generatePdf(data: any): Promise<string> {
//     return new Promise((resolve, reject) => {
//       try {
//         const doc = new PDFDocument();
//         const buffers: Buffer[] = [];

//         doc.on('data', buffers.push.bind(buffers));
//         doc.on('end', () => {
//           const pdfBuffer = Buffer.concat(buffers);
//           const pdfBase64 = pdfBuffer.toString('base64');
//           resolve(pdfBase64);
//         });

//         this.generateChapterPage(doc, data.chapter);

//         data.members.forEach((member: any) => {
//           this.generateMemberPage(doc, member);
//         });

//         doc.end();
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }

//   private generateChapterPage(doc: PDFKit.PDFDocument, chapter: any) {
//     doc.fontSize(24).text('Chapter Details', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12);
//     doc.text(`Chapter Name: ${chapter.chapterName}`);
//     doc.text(`Location: ${chapter.location}`);
//     doc.text(`Member Size: ${chapter.memberSize}`);
//     doc.text(`Regional Rank: ${chapter.regionalRank}`);
//     doc.text(`All India Rank: ${chapter.allIndiaRank}`);
//     doc.text(`Global Rank: ${chapter.globalRank}`);

//     if (chapter.chapterLogo) {
//       try {
//         console.log('Chapter Logo Base64 Length:', chapter.chapterLogo.length);
//         console.log('Chapter Logo Base64 Snippet:', chapter.chapterLogo.slice(0, 30));

//         const logoBuffer = Buffer.from(chapter.chapterLogo, 'base64');
//         doc.image(logoBuffer, {
//           fit: [250, 250],
//           align: 'center',
//           valign: 'center'
//         });
//       } catch (error) {
//         console.error('Error processing chapter logo:', error);
//       }
//     }
//   }

//   private generateMemberPage(doc: PDFKit.PDFDocument, member: any) {
//     doc.addPage();
//     doc.fontSize(24).text('Member Details', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12);
//     doc.text(`Name: ${member.name}`);
//     doc.text(`Company: ${member.company}`);
//     doc.text(`Email: ${member.email}`);
//     doc.text(`Phone: ${member.phone}`);
//     doc.text(`Category: ${member.category}`);

//     if (member.memberPhoto) {
//       try {
//         console.log('Member Photo Base64 Length:', member.memberPhoto.length);
//         console.log('Member Photo Base64 Snippet:', member.memberPhoto.slice(0, 30));

//         // Log the entire Base64 string for debugging (optional)
//         // console.log('Member Photo Base64:', member.memberPhoto);

//         const memberPhotoBuffer = Buffer.from(member.memberPhoto, 'base64');

//         // Log the buffer length to ensure it's decoded correctly
//         console.log('Member Photo Buffer Length:', memberPhotoBuffer.length);

//         doc.image(memberPhotoBuffer, {
//           fit: [200, 200],
//           align: 'center',
//           valign: 'center'
//         });
//       } catch (error) {
//         console.error('Error processing member photo:', error);
//       }
//     }

//     if (member.companyPhoto) {
//       try {
//         console.log('Company Photo Base64 Length:', member.companyPhoto.length);
//         console.log('Company Photo Base64 Snippet:', member.companyPhoto.slice(0, 30));

//         // Log the entire Base64 string for debugging (optional)
//         // console.log('Company Photo Base64:', member.companyPhoto);

//         const companyPhotoBuffer = Buffer.from(member.companyPhoto, 'base64');

//         // Log the buffer length to ensure it's decoded correctly
//         console.log('Company Photo Buffer Length:', companyPhotoBuffer.length);

//         doc.image(companyPhotoBuffer, {
//           fit: [200, 200],
//           align: 'right',
//           valign: 'center'
//         });
//       } catch (error) {
//         console.error('Error processing company photo:', error);
//       }
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable, Writable } from 'stream';

@Injectable()
export class PdfService {
  async generatePdf(data: any): Promise<Readable> {
    return new Promise<Readable>((resolve, reject) => {
      const doc = new PDFDocument();

      // Customize your PDF here using data from the frontend
      doc.text('Generated PDF from backend', 100, 100);

      // Create a writable stream and pipe the PDF document to it
      const writableStream: Writable = new Writable();
      doc.pipe(writableStream);

      // End the PDF document
      doc.end();

      // Resolve with the readable stream
      resolve(writableStream as unknown as Readable);
    });
  }
}

