// src/pdf/pdf.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import * as path from 'path';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generatePdf(data: GeneratePdfDto, files: {
    chapterLogo?: Express.Multer.File,
    memberPhotos: Express.Multer.File[],
    companyPhotos: Express.Multer.File[]
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.addChapterPage(doc, data, files.chapterLogo);
      doc.addPage();
      this.addMemberPages(doc, data.members, files.memberPhotos, files.companyPhotos);

      doc.end();
    });
  }

  private addChapterPage(doc: PDFKit.PDFDocument, data: GeneratePdfDto, chapterLogo?: Express.Multer.File) {
    // Add background image
    const backgroundPath = path.join(process.cwd(), 'src', 'assets', 'chapter_background.png');
    doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

    const pageCenter = (doc.page.width / 2) - 250;
    const contentStartY = doc.page.height / 2 - 100;

    // BNI text (bold and centered)
    doc.font('Helvetica-Bold').fontSize(48).fillColor('#FF0000')
        .text('BNI', pageCenter, contentStartY, {
            align: 'center',
            width: doc.page.width - 100
        });

    // Chapter name
    doc.font('Helvetica').fontSize(36).fillColor('#000000')
        .text(data.chapterName, pageCenter, contentStartY + 60, {
            align: 'center',
            width: doc.page.width - 100
        });

    // Year
    doc.fontSize(32).fillColor('#808080')
        .text('2024', pageCenter, contentStartY + 110, {
            align: 'center',
            width: doc.page.width - 100
        });

    // Add chapter logo if available
    if (chapterLogo) {
        doc.image(chapterLogo.buffer, doc.page.width / 2 - 38, 470, { width: 70, height: 70 });
    }

    // Bottom information
    
    const cellWidth = doc.page.width / 5;
    const valueFontSize = 14;
    const labelFontSize = 11;

    const addCell = (value: string, label: string, x: number, y: number, width: number) => {
        doc.fontSize(valueFontSize).fillColor('#FF0000').font('Helvetica-Bold');
        doc.text(value, x, y, { width, align: 'center' });

        doc.fontSize(labelFontSize).fillColor('#000000').font('Helvetica');
        doc.text(label, x, y + 25, { width, align: 'center' });

        if (x + width < doc.page.width) {
            doc.moveTo(x + width, y - 10).lineTo(x + width, y + 50).stroke();
        }
    };

    // Adjust the starting y-coordinate of the bottom information to fit within the first page
    const bottomInfoY = doc.page.height - 150; // Adjust this value as needed

    // Add cells
    addCell(data.location, 'Location', 0, bottomInfoY, cellWidth);
    addCell(data.memberSize, 'Members', cellWidth, bottomInfoY, cellWidth);
    addCell(data.regionalRank, 'Regional Rank', cellWidth * 2, bottomInfoY, cellWidth);
    addCell(data.allIndiaRank, 'All India Rank', cellWidth * 3, bottomInfoY, cellWidth);
    addCell(data.globalRank, 'Global Rank', cellWidth * 4, bottomInfoY, cellWidth);
}


  private addMemberPages(
    doc: PDFKit.PDFDocument, 
    members: any[], 
    memberPhotos: Express.Multer.File[],
    companyPhotos: Express.Multer.File[]
  ) {
    const backgroundPath = path.join(process.cwd(), 'src', 'assets', 'member_background.png');
    const membersPerPage = 6;

    members.forEach((member, index) => {
      if (index % membersPerPage === 0) {
        if (index !== 0) {
          doc.addPage();
        }
        doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });
      }

      const boxX = 40;
      const boxY = 40 + (index % membersPerPage) * 127;
      const boxWidth = doc.page.width - 80;
      const boxHeight = 120;

      // Draw white box
      doc.fill('white')
        .rect(boxX, boxY, boxWidth, boxHeight)
        .fill();

      // Red rectangle for member number
      doc.fillColor('#FF0000').rect(boxX + 10, boxY + 10, 30, 30).fill();
      doc.fillColor('white').fontSize(16).text((index + 1).toString(), boxX + 20, boxY + 17);

      // Member details
      const startY = boxY +10;
      const startX = boxX + 50;
      const lineHeight = 22;

      // Member name (bold)
      doc.font('Helvetica-Bold').fontSize(11).fillColor('black');
      doc.text(`${member.name}`, startX, startY);

      // Company name, phone, email (normal weight)
      doc.font('Helvetica').fontSize(11).fillColor('black');
      doc.text(`${member.company}`, startX, startY + lineHeight);
      doc.text(`${member.phone}`, startX, startY + lineHeight * 2);
      doc.text(`${member.email}`, startX, startY + lineHeight * 3);

      // Category (bold and red)
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#cc0000');
      doc.text(`${member.category}`, startX, startY + lineHeight * 4);

      // Company logo
      if (companyPhotos[index]) {
        doc.image(companyPhotos[index].buffer, boxX + 160, startY + 25, { width: 50, height: 50 });
      }

      // Member photo
      if (memberPhotos[index]) {
        doc.image(memberPhotos[index].buffer, boxX + 230, startY +15, { width: 70, height: 70 });
      }

      // Horizontal lines
      const lineStartX = boxX + boxWidth - 200;
      doc.lineWidth(0.5).strokeColor('#999999');
      for (let i = 0; i < 4; i++) {
        doc.moveTo(lineStartX, startY + i * lineHeight+20)
          .lineTo(boxX + boxWidth - 20, startY + i * lineHeight+20)
          .stroke();
      }
    });
  }
}


