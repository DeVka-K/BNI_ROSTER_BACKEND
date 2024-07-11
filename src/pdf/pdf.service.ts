// src/pdf/pdf.service.ts

import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Multer } from 'multer';

@Injectable()
export class PdfService {
  async generatePdf(
    chapterName: string,
    location: string,
    memberSize: string,
    regionalRank: string,
    allIndiaRank: string,
    globalRank: string,
    members: any[],
    chapterLogo: Express.Multer.File,
  ): Promise<string> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
    });

    const pdfPath = path.join(process.cwd(), 'bni_roster.pdf');
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);


    // Chapter page
    this.addChapterPage(doc, chapterName, location, memberSize, regionalRank, allIndiaRank, globalRank, chapterLogo);
    doc.addPage();

    // Member pages
    this.addMemberPages(doc, members);

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(pdfPath));
      writeStream.on('error', reject);
    });
  }

  private addChapterPage(
    doc: PDFKit.PDFDocument,
    chapterName: string,
    location: string,
    memberSize: string,
    regionalRank: string,
    allIndiaRank: string,
    globalRank: string,
    chapterLogo: Express.Multer.File 
  ) {
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
      .text(chapterName, pageCenter, contentStartY + 60, {
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
      doc.image(chapterLogo.buffer, doc.page.width / 2 - 25, 390, { width: 50, height: 50 });
    }

    // Bottom information
    const bottomY = doc.page.height - 80;
    const cellWidth = doc.page.width / 5;
    const valueFontSize = 16;
    const labelFontSize = 12;

    const addCell = (value: string, label: string, x: number, y: number, width: number) => {
      doc.fontSize(valueFontSize).fillColor('#FF0000').font('Helvetica-Bold');
      doc.text(value, x, y, { width, align: 'center' });

      doc.fontSize(labelFontSize).fillColor('#000000').font('Helvetica');
      doc.text(label, x, y + 25, { width, align: 'center' });

      if (x + width < doc.page.width) {
        doc.moveTo(x + width, y - 10).lineTo(x + width, y + 50).stroke();
      }
    };

    // Add cells
    addCell(location, 'Location', 0, bottomY, cellWidth);
    addCell(memberSize, 'Members', cellWidth, bottomY, cellWidth);
    addCell(regionalRank, 'Regional Rank', cellWidth * 2, bottomY, cellWidth);
    addCell(allIndiaRank, 'All India Rank', cellWidth * 3, bottomY, cellWidth);
    addCell(globalRank, 'Global Rank', cellWidth * 4, bottomY, cellWidth);
  }

  private addMemberPages(doc: PDFKit.PDFDocument, members: any[]) {
    const membersPerPage = 5;
    let currentPageMembers: any[] = [];

    members.forEach((member, index) => {
      currentPageMembers.push(member);
      if (currentPageMembers.length === membersPerPage || index === members.length - 1) {
        this.addMemberPage(doc, currentPageMembers);
        currentPageMembers = [];
        if (index !== members.length - 1) {
          doc.addPage();
        }
      }
    });
  }

  private addMemberPage(doc: PDFKit.PDFDocument, members: any[]) {
    const backgroundPath = path.join(process.cwd(), 'src', 'assets', 'member_background.png');
    doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

    members.forEach((member, index) => {
      const boxX = 50;
      const boxY = 50 + index * 160;
      const boxWidth = doc.page.width - 100;
      const boxHeight = 140;

      // Draw white box
      doc.fill('white')
        .rect(boxX, boxY, boxWidth, boxHeight)
        .fill();

      // Red rectangle for member number
      doc.fillColor('#FF0000').rect(boxX + 10, boxY + 10, 30, 30).fill();
      doc.fillColor('white').fontSize(16).text((index + 1).toString(), boxX + 20, boxY + 17);

      // Member details
      const startY = boxY + 10;
      const startX = boxX + 50;
      const lineHeight = 22;

      // Member name (bold)
      doc.font('Helvetica-Bold').fontSize(14).fillColor('black');
      doc.text(`${member.name}`, startX, startY);

      // Company name, phone, email (normal weight)
      doc.font('Helvetica').fontSize(14).fillColor('black');
      doc.text(`${member.company}`, startX, startY + lineHeight);
      doc.text(`${member.phone}`, startX, startY + lineHeight * 2);
      doc.text(`${member.email}`, startX, startY + lineHeight * 3);

      // Category (bold and red)
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#cc0000');
      doc.text(`${member.category}`, startX, startY + lineHeight * 4);

      // Company logo
      if (member.companyPhoto) {
        doc.image(member.companyPhoto.buffer, boxX + 140, startY, { width: 50, height: 50 });
      }

      // Member photo
      if (member.memberPhoto) {
        doc.image(member.memberPhoto.buffer, boxX + 190, startY, { width: 70, height: 70 });
      }

      // Horizontal lines
      const lineStartX = boxX + boxWidth - 200;
      doc.lineWidth(0.5).strokeColor('#999999');
      for (let i = 0; i < 5; i++) {
        doc.moveTo(lineStartX, startY + i * lineHeight)
          .lineTo(boxX + boxWidth - 20, startY + i * lineHeight)
          .stroke();
      }
    });
  }
}