//final code
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

    // Add background image
    const backgroundPath = path.join(__dirname, '..', '..', 'assets', 'bnibackground.png'); // Update this path to your actual background image path
    doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

    // Add BNI logo in the center at the top
    const bniLogoPath = path.join(__dirname, '..', '..', 'assets', 'bnilogo3.png'); // Update this path to your actual BNI logo path
    doc.image(bniLogoPath, (doc.page.width - 200) / 2, 300, { width: 200, height: 150 });

    // Add chapter name below the BNI logo
    doc.fontSize(50).fillColor('black').text(data.chapterName, 50, 480, { align: 'center' });

    // Add chapter logo below the chapter name
    if (data.chapterLogo) {
      const chapterLogoPath = path.join(__dirname, '..', '..', 'uploads', 'images', data.chapterLogo);
      doc.image(chapterLogoPath, (doc.page.width - 100) / 2, 530, { width: 100, height: 100 });
      console.log(`Adding chapter logo from ${chapterLogoPath}`);
    }

   
    //bottom information

    const statsYPosition = 660; // Fixed y-axis position
    const cellWidth = doc.page.width / 5;
    const valueFontSize = 16;
    const labelFontSize = 12;

    // Function to add cell with vertical line
    const addCell = (value, label, x, y, width) => {
      doc.fontSize(valueFontSize).fillColor('#FF0000').font('Helvetica-Bold');
      doc.text(value, x, y, { width, align: 'center' });

      doc.fontSize(labelFontSize).fillColor('#000000').font('Helvetica');
      doc.text(label, x, y + 25, { width, align: 'center' });

      if (x + width < doc.page.width) {
        doc.moveTo(x + width, y - 10).lineTo(x + width, y + 50).stroke();
      }
    };

    // Add cells with try-catch to handle any errors
    try {
      addCell(data.location, 'Location', 0, statsYPosition, cellWidth);
      addCell(data.memberSize
        , 'Members', cellWidth, statsYPosition, cellWidth);
      addCell(data.regionalRank, 'Regional Rank', cellWidth * 2, statsYPosition, cellWidth);
      addCell(data.allIndiaRank, 'All India Rank', cellWidth * 3, statsYPosition, cellWidth);
      addCell(data.globalRank, 'Global Rank', cellWidth * 4, statsYPosition, cellWidth);
    } catch (error) {
      console.error("Error adding cells to PDF:", error);
    }




    // Add member details starting from the second page
 


    doc.addPage();
    this.addPageDesign(doc);

    data.members.forEach((member, index) => {
      if (index > 0 && index % 6 === 0) {
        doc.addPage();
        this.addPageDesign(doc);
      }
      this.addMemberToPDF(doc, member, index % 6);
    });

    doc.end();

    return pdfPath;
  }
// Have to change 
  private addPageDesign(doc: PDFKit.PDFDocument) {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const topBannerHeight = 40;

    // Red banner at the top
    doc.rect(0, 0, pageWidth, topBannerHeight).fill('#FF0000');

    // White triangle in top-right corner
    doc.polygon([pageWidth - topBannerHeight, 0], [pageWidth, 0], [pageWidth, topBannerHeight]).fill('#FFFFFF');

    // White main content area
    doc.rect(0, topBannerHeight, pageWidth, pageHeight - topBannerHeight).fill('#FFFFFF');
  }

  private addMemberToPDF(doc: PDFKit.PDFDocument, member: MemberData, index: number) {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 20;
    const topBannerHeight = 40;
    const cardSpacing = 10;
    const cardHeight = (pageHeight - 2 * margin - topBannerHeight - 6 * cardSpacing) / 7;

    const x = margin;
    const y = margin + topBannerHeight + (index % 6) * (cardHeight + cardSpacing);

    // Add smaller number box
    const numberBoxWidth = 25;
    const numberBoxHeight = 25;
    doc.rect(x, y, numberBoxWidth, numberBoxHeight).fill('#FF0000');
    doc.fill('#FFFFFF').fontSize(14).font('Helvetica-Bold');
    doc.text((index + 1).toString(), x, y + 6, {
      width: numberBoxWidth,
      align: 'center'
    });

    // Add text information
    doc.fill('#000000').fontSize(10).font('Helvetica');
    const textX = x + numberBoxWidth + 10;
    const textY = y;
    const textWidth = 180;

    doc.font('Helvetica-Bold').text(member.name || '', textX, textY, { width: textWidth });
    doc.font('Helvetica').text(member.companyName || '', textX, textY + 15, { width: textWidth });
    doc.text(member.phone || '', textX, textY + 30, { width: textWidth });
    doc.text(member.email || '', textX, textY + 45, { width: textWidth });
    doc.text(member.category || '', textX, textY + 60, { width: textWidth });

    // Add company logo and person's photo
    const imageSize = 75; // Set image size to match text height
    const imageY = y;
    const logoX = textX + textWidth + 10;
    const photoX = logoX + imageSize + 10;

    if (member.companyLogo) {
      const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.companyLogo);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, logoX, imageY, { width: imageSize, height: imageSize });
      }
    }
    if (member.photo) {
      const photoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.photo);
      if (fs.existsSync(photoPath)) {
        doc.image(photoPath, photoX, imageY, { width: imageSize, height: imageSize });
      }
    }

    // Add horizontal lines for notes
    const lineXStart = photoX + imageSize + 20;
    const lineLength = 150;
    const lineYStart = y;
    const lineSpacing = imageSize / 5;

    
    doc.lineWidth(0.1);
    for (let i = 0; i < 5; i++) {
      const lineY = lineYStart + i * lineSpacing;
      doc.moveTo(lineXStart, lineY).lineTo(lineXStart + lineLength, lineY).stroke();
    }
  }
} 

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

//     // First page with chapter information (unchanged)
//     this.addFirstPage(doc, data);

//     // Add member details starting from the second page
//     doc.addPage();
//     this.addPageDesign(doc);

//     data.members.forEach((member, index) => {
//       if (index > 0 && index % 7 === 0) {
//         doc.addPage();
//         this.addPageDesign(doc);
//       }
//       this.addMemberToPDF(doc, member, index);
//     });

//     doc.end();

//     return pdfPath;
//   }

//   private addFirstPage(doc: PDFKit.PDFDocument, data: ChapterData) {
//     // Add background image
//     const backgroundPath = path.join(__dirname, '..', '..', 'assets', 'bnibackground.png');
//     doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

//     // Add BNI logo in the center at the top
//     const bniLogoPath = path.join(__dirname, '..', '..', 'assets', 'bnilogo3.png');
//     doc.image(bniLogoPath, (doc.page.width - 200) / 2, 300, { width: 200, height: 150 });

//     // Add chapter name below the BNI logo
//     doc.fontSize(50).fillColor('black').text(data.chapterName, 50, 480, { align: 'center' });

//     // Add chapter logo below the chapter name
//     if (data.chapterLogo) {
//       const chapterLogoPath = path.join(__dirname, '..', '..', 'uploads', 'images', data.chapterLogo);
//       doc.image(chapterLogoPath, (doc.page.width - 100) / 2, 530, { width: 100, height: 100 });
//       console.log(`Adding chapter logo from ${chapterLogoPath}`);
//     }

//     // Bottom information
//     const statsYPosition = 660;
//     const cellWidth = doc.page.width / 5;
//     const valueFontSize = 16;
//     const labelFontSize = 12;

//     const addCell = (value, label, x, y, width) => {
//       doc.fontSize(valueFontSize).fillColor('#FF0000').font('Helvetica-Bold');
//       doc.text(value, x, y, { width, align: 'center' });

//       doc.fontSize(labelFontSize).fillColor('#000000').font('Helvetica');
//       doc.text(label, x, y + 25, { width, align: 'center' });

//       if (x + width < doc.page.width) {
//         doc.moveTo(x + width, y - 10).lineTo(x + width, y + 50).stroke();
//       }
//     };

//     try {
//       addCell(data.location, 'Location', 0, statsYPosition, cellWidth);
//       addCell(data.memberSize.toString(), 'Members', cellWidth, statsYPosition, cellWidth);
//       addCell(data.regionalRank, 'Regional Rank', cellWidth * 2, statsYPosition, cellWidth);
//       addCell(data.allIndiaRank, 'All India Rank', cellWidth * 3, statsYPosition, cellWidth);
//       addCell(data.globalRank, 'Global Rank', cellWidth * 4, statsYPosition, cellWidth);
//     } catch (error) {
//       console.error("Error adding cells to PDF:", error);
//     }
//   }

//   private addPageDesign(doc: PDFKit.PDFDocument) {
//     const pageWidth = 595.28;
//     const pageHeight = 841.89;
//     const topBannerHeight = 40;

//     // Red banner at the top
//     doc.rect(0, 0, pageWidth, topBannerHeight).fill('#FF0000');

//     // White triangle in top-right corner
//     doc.polygon([pageWidth - topBannerHeight, 0], [pageWidth, 0], [pageWidth, topBannerHeight]).fill('#FFFFFF');

//     // White main content area
//     doc.rect(0, topBannerHeight, pageWidth, pageHeight - topBannerHeight).fill('#FFFFFF');
//   }

//   private addMemberToPDF(doc: PDFKit.PDFDocument, member: MemberData, index: number) {
//     const pageWidth = 595.28;
//     const pageHeight = 841.89;
//     const margin = 20;
//     const topBannerHeight = 40;
//     const cardSpacing = 10;
//     const cardHeight = (pageHeight - 2 * margin - topBannerHeight - 6 * cardSpacing) / 7;

//     const x = margin;
//     const y = margin + topBannerHeight + (index % 7) * (cardHeight + cardSpacing);

//     // Add smaller number box
//     const numberBoxWidth = 25;
//     const numberBoxHeight = 25;
//     doc.rect(x, y, numberBoxWidth, numberBoxHeight).fill('#FF0000');
//     doc.fill('#FFFFFF').fontSize(14).font('Helvetica-Bold');
//     doc.text((index + 1).toString(), x, y + 6, {
//       width: numberBoxWidth,
//       align: 'center'
//     });

//     // Add text information
//     doc.fill('#000000').fontSize(10).font('Helvetica');
//     const textX = x + numberBoxWidth + 10;
//     const textY = y;
//     const textWidth = 180;

//     doc.font('Helvetica-Bold').text(member.name || '', textX, textY, { width: textWidth });
//     doc.font('Helvetica').text(member.companyName || '', textX, textY + 15, { width: textWidth });
//     doc.text(member.phone || '', textX, textY + 30, { width: textWidth });
//     doc.text(member.email || '', textX, textY + 45, { width: textWidth });
//     doc.text(member.category || '', textX, textY + 60, { width: textWidth });

//     // Add company logo and person's photo
//     const imageSize = 75;
//     const imageY = y;
//     const logoX = textX + textWidth + 10;
//     const photoX = logoX + imageSize + 10;

//     if (member.companyLogo) {
//       const logoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.companyLogo);
//       if (fs.existsSync(logoPath)) {
//         doc.image(logoPath, logoX, imageY, { width: imageSize, height: imageSize });
//       }
//     }
//     if (member.photo) {
//       const photoPath = path.join(__dirname, '..', '..', 'uploads', 'images', member.photo);
//       if (fs.existsSync(photoPath)) {
//         doc.image(photoPath, photoX, imageY, { width: imageSize, height: imageSize });
//       }
//     }

//     // Add horizontal lines for notes
//     const lineXStart = photoX + imageSize + 20;
//     const lineLength = 150;
//     const lineYStart = y;
//     const lineSpacing = imageSize / 5;
//     doc.lineWidth(0.1);
//     for (let i = 0; i < 5; i++) {
//       const lineY = lineYStart + i * lineSpacing;
//       doc.moveTo(lineXStart, lineY).lineTo(lineXStart + lineLength, lineY).stroke();
//     }
//   }
// }





