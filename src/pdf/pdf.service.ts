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
    const backgroundPath = path.join(process.cwd(), 'src', 'assets', 'chapter_background.png');
    doc.image(backgroundPath, 0, 0, {width: doc.page.width, height: doc.page.height});
  
    const pageCenter = (doc.page.width / 2) - 250; // Shifted 50 points to the left
    const contentStartY = doc.page.height / 2 - 100;
  
    // BNI text (bold and centered)
    doc.font('Helvetica-Bold').fontSize(48).fillColor('#FF0000')
       .text('BNI', pageCenter, contentStartY, { 
         align: 'center',
         width: doc.page.width - 100 // Adjusted width to maintain centering
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
    // Logo
    // const logoPath = path.join(process.cwd(), 'src', 'assets', 'company_logo.png');
    // doc.image(logoPath, doc.page.width / 2 - 25, 390, { width: 50, height: 50 });
  
    // Bottom information
    const bottomY = doc.page.height - 80; // Increased padding at the bottom
    const cellWidth = doc.page.width / 5;
    const valueFontSize = 16;
    const labelFontSize = 12;
  
    // Function to add cell with vertical line
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

  private addMemberPage(doc: PDFKit.PDFDocument, member: any, index: number) {
    const backgroundPath = path.join(process.cwd(), 'src', 'assets', 'member_background.png');
    doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });
  
    // Red rectangle for member number
    doc.fillColor('#FF0000').rect(50, 70, 30, 30).fill();
    doc.fillColor('white').fontSize(16).text(index.toString(), 60, 77);
  
    // Member details
    const startY = 50;
    const lineHeight = 22; // Reduced line height
    
    // Member name (bold)
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black');
    doc.text(`${member.name}`, 90, startY);
    
    // Company name, phone, email (normal weight)
    doc.font('Helvetica').fontSize(14).fillColor('black');
    doc.text(`${member.company}`, 90, startY + lineHeight);
    doc.text(`${member.phone}`, 90, startY + lineHeight * 2);
    doc.text(`${member.email}`, 90, startY + lineHeight * 3);
    
    // Category (bold and red)
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#cc0000');
    doc.text(`${member.category}`, 90, startY + lineHeight * 4);
  
    // Company logo (moved slightly left)
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'company_logo.png');
    doc.image(logoPath, 250, startY, { width: 60, height: 60 });
  
    // Member photo (moved slightly left)
    const photoPath = path.join(process.cwd(), 'src', 'assets', 'member_photo.png');
    doc.image(photoPath, 320, startY, { width: 80, height: 80 });
  
    // Horizontal lines (lighter color)
    const lineStartX = 410;
    doc.lineWidth(0.5).strokeColor('#999999'); // Lighter, thinner lines
    for (let i = 0; i < 5; i++) {
      doc.moveTo(lineStartX, startY + i * lineHeight)
         .lineTo(doc.page.width - 50, startY + i * lineHeight)
         .stroke();
    }
  }
}