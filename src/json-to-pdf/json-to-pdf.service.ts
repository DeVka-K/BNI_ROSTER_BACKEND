// src/json-to-pdf/json-to-pdf.service.ts
import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { JsonToPdfCreatedEvent } from './events/json-to-pdf-created.events';
import { GetJsonToPdfQuery } from './queries/get-json-to-pdf.query';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

const IMAGES_BASE_PATH = process.env.IMAGES_BASE_PATH || path.resolve(__dirname, '../../../images');
const PDFS_BASE_PATH = process.env.PDFS_BASE_PATH || path.resolve(__dirname, '../../../pdfs');

@Injectable()
export class JsonToPdfService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async getPdfPreview(jsonData: any): Promise<string> {
    const query = new GetJsonToPdfQuery(jsonData);
    return this.queryBus.execute(query);
  }

  async createPdf(jsonData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const filename = `output_${Date.now()}.pdf`;
        const filePath = path.join(PDFS_BASE_PATH, filename);
        console.log('Creating PDF at:', filePath);

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const margin = 20;
        const numberBoxWidth = 20;
        const numberBoxHeight = 20;
        const cardSpacing = 10;
        const topBannerHeight = 40;

        const addBusinessCard = (data, index) => {
          const cardHeight = (pageHeight - 2 * margin - topBannerHeight - 6 * cardSpacing) / 7;
          const x = margin;
          const y = margin + topBannerHeight + (index % 7) * (cardHeight + cardSpacing);
        
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
          const textHeight = 75; // Approximate height of text content
        
          doc.font('Helvetica-Bold').text(data.name || '', textX, textY, { width: textWidth });
          doc.font('Helvetica').text(data.companyName || '', textX, textY + 15, { width: textWidth });
          doc.text(data.phoneNumber || '', textX, textY + 30, { width: textWidth });
          doc.text(data.email || '', textX, textY + 45, { width: textWidth });
          doc.text(data.businessType || '', textX, textY + 60, { width: textWidth });
        
          // Add company logo and person's photo
          const imageSize = textHeight; // Set image size to match text height
          const imageY = y;
          const logoX = textX + textWidth + 10;
          const photoX = logoX + imageSize + 10;
        
          if (data.logoUrl) {
            const logoPath = path.join(IMAGES_BASE_PATH, data.logoUrl);
            if (fs.existsSync(logoPath)) {
              doc.image(logoPath, logoX, imageY, { width: imageSize, height: imageSize });
            }
          }
          if (data.photoUrl) {
            const photoPath = path.join(IMAGES_BASE_PATH, data.photoUrl);
            if (fs.existsSync(photoPath)) {
              doc.image(photoPath, photoX, imageY, { width: imageSize, height: imageSize });
            }
          }
        
          // Add horizontal lines for notes
          const lineXStart = photoX + imageSize + 20;
          const lineLength = 150;
          const lineYStart = y;
          const lineSpacing = textHeight / 5;
          doc.lineWidth(0.5);
          for (let i = 0; i < 5; i++) {
            const lineY = lineYStart + i * lineSpacing;
            doc.moveTo(lineXStart, lineY).lineTo(lineXStart + lineLength, lineY).stroke();
          }
        };
        const addPage = () => {
          // Red banner at the top
          doc.rect(0, 0, pageWidth, topBannerHeight).fill('#FF0000');

          // White triangle in top-right corner
          doc.polygon([pageWidth - topBannerHeight, 0], [pageWidth, 0], [pageWidth, topBannerHeight]).fill('#FFFFFF');

          // White main content area
          doc.rect(0, topBannerHeight, pageWidth, pageHeight - topBannerHeight).fill('#FFFFFF');
        };

        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

        dataArray.forEach((data, index) => {
          if (index % 7 === 0) {
            if (index > 0) doc.addPage();
            addPage();
          }
          addBusinessCard(data, index);
        });

        doc.end();

        writeStream.on('finish', () => {
          console.log('PDF creation finished');
          resolve(filename);
        });
        writeStream.on('error', (error) => {
          console.error('Error writing PDF:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Error in createPdf:', error);
        reject(error);
      }
    });
  }
}


//   async createPdf(jsonData: any): Promise<string> {
//     return new Promise((resolve, reject) => {
//       try {
//         const doc = new PDFDocument();
//         const filename = `output_${Date.now()}.pdf`;
//         const filePath = path.join(__dirname, '../../../pdfs', filename);
//         console.log('Creating PDF at:', filePath);
  
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);
  
//         // Add formatted content to PDF
//         doc.fontSize(18).text('Business Card Information', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(12).text(`Name: ${jsonData.name}`);
//         doc.text(`Company: ${jsonData.companyName}`);
//         doc.text(`Phone: ${jsonData.phoneNumber}`);
//         doc.text(`Email: ${jsonData.email}`);
//         doc.text(`Business Type: ${jsonData.businessType}`);
        
//         doc.end();
  
//         writeStream.on('finish', () => {
//           console.log('PDF creation finished');
//           resolve(filename);  // Return just the filename, not the full path
//         });
//         writeStream.on('error', (error) => {
//           console.error('Error writing PDF:', error);
//           reject(error);
//         });
//       } catch (error) {
//         console.error('Error in createPdf:', error);
//         reject(error);
//       }
//     });
//   }
// }
