// src/pdf/pdf.service.ts

import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generatePdf(chapterName: string, location: string, memberSize: string, regionalRank: string, allIndiaRank: string, globalRank: string, members: any[]): Promise<string> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
    });

    const pdfPath = path.join(process.cwd(), 'bni_roster.pdf');
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Chapter page
    this.addChapterPage(doc, chapterName, location, memberSize, regionalRank, allIndiaRank, globalRank);

    // Member pages
    members.forEach((member, index) => {
      doc.addPage();
      this.addMemberPage(doc, member, index + 1);
    });

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(pdfPath));
      writeStream.on('error', reject);
    });
  }

  private addChapterPage(doc: PDFKit.PDFDocument, chapterName: string, location: string, memberSize: string, regionalRank: string, allIndiaRank: string, globalRank: string) {
    const backgroundPath = path.join(process.cwd(),'src', 'assets', 'chapter_background.png');
    doc.image(backgroundPath, 0, 0, {width: doc.page.width, height: doc.page.height});

    // Chapter details
    doc.fontSize(24).fillColor('white').text('BNI', 50, 200, { align: 'center' });
    doc.fontSize(20).text(chapterName, 50, 230, { align: 'center' });
    doc.fontSize(16).text('2024', 50, 260, { align: 'center' });

    const infoY = 300;
    const infoSpacing = 30;
    doc.fontSize(12).fillColor('black');
    doc.text(`Location: ${location}`, 50, infoY, { align: 'center' });
    doc.text(`Members: ${memberSize}`, 50, infoY + infoSpacing, { align: 'center' });
    doc.text(`Regional Rank: ${regionalRank}`, 50, infoY + infoSpacing * 2, { align: 'center' });
    doc.text(`All India Rank: ${allIndiaRank}`, 50, infoY + infoSpacing * 3, { align: 'center' });
    doc.text(`Global Rank: ${globalRank}`, 50, infoY + infoSpacing * 4, { align: 'center' });
  }

  private addMemberPage(doc: PDFKit.PDFDocument, member: any, index: number) {
    const backgroundPath = path.join(process.cwd(),'src' ,'assets', 'member_background.png');
    doc.image(backgroundPath, 0, 0, {width: doc.page.width, height: doc.page.height});

    // Member details
    const startY = 150;
    const lineHeight = 25;
    doc.fontSize(16).fillColor('black').text(`Member ${index}`, 50, startY);
    doc.fontSize(12);
    doc.text(`Name: ${member.name}`, 70, startY + lineHeight);
    doc.text(`Company: ${member.company}`, 70, startY + lineHeight * 2);
    doc.text(`Email: ${member.email}`, 70, startY + lineHeight * 3);
    doc.text(`Phone: ${member.phone}`, 70, startY + lineHeight * 4);
    doc.text(`Category: ${member.category}`, 70, startY + lineHeight * 5);

    // Placeholder for member photo
    doc.rect(400, startY, 150, 150).stroke();
    doc.text('Member Photo', 425, startY + 70);

    // Placeholder for company logo
    doc.rect(400, startY + 200, 150, 150).stroke();
    doc.text('Company Logo', 425, startY + 270);
  }
}