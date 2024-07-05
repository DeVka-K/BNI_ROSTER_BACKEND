import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfGenerator {
  async generate(chapter: any, members: any[]) {
    const doc = new PDFDocument();
    
    this.generateChapterPage(doc, chapter);

    for (const member of members) {
      this.generateMemberPage(doc, member);
    }

    doc.end();
    return new Promise((resolve) => {
      const chunks: any[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  private generateChapterPage(doc: PDFKit.PDFDocument, chapter: any) {
    const data = chapter.getData();
    doc.fontSize(24).text('Chapter Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Chapter Name: ${data.chapterName}`);
    doc.text(`Location: ${data.location}`);
    doc.text(`Member Size: ${data.memberSize}`);
    doc.text(`Regional Rank: ${data.regionalRank}`);
    doc.text(`All India Rank: ${data.allIndiaRank}`);
    doc.text(`Global Rank: ${data.globalRank}`);
    
    if (data.chapterLogo) {
      doc.image(Buffer.from(data.chapterLogo, 'base64'), {
        fit: [250, 250],
        align: 'center',
        valign: 'center'
      });
    }
  }

  private generateMemberPage(doc: PDFKit.PDFDocument, member: any) {
    const data = member.getData();
    doc.addPage();
    doc.fontSize(24).text('Member Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Name: ${data.name}`);
    doc.text(`Company: ${data.company}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Phone: ${data.phone}`);
    doc.text(`Category: ${data.category}`);
    
    if (data.memberPhoto) {
      doc.image(Buffer.from(data.memberPhoto, 'base64'), {
        fit: [200, 200],
        align: 'center',
        valign: 'center'
      });
    }
    
    if (data.companyPhoto) {
      doc.image(Buffer.from(data.companyPhoto, 'base64'), {
        fit: [200, 200],
        align: 'center',
        valign: 'center'
      });
    }
  }
}