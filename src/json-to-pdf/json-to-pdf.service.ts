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
        const numberBoxWidth = 20; // Reduced the width of the numbered boxes
        const numberBoxHeight = 20; // Reduced the height of the numbered boxes
        const cardSpacing = 10;
        const topBannerHeight = 40; // Adjusted the height of the top banner

        const addBusinessCard = (data, index) => {
          const cardHeight = (pageHeight - 2 * margin - topBannerHeight - 6 * cardSpacing) / 7;
          const x = margin;
          const y = margin + topBannerHeight + (index % 7) * (cardHeight + cardSpacing);

          // Add smaller number box
          doc.rect(x, y, numberBoxWidth, numberBoxHeight).fill('#FF0000');
          doc.fill('#FFFFFF').fontSize(12).font('Helvetica-Bold'); // Adjusted font size
          doc.text((index + 1).toString(), x, y + 5, {
            width: numberBoxWidth,
            align: 'center'
          });

          // Add text information
          doc.fill('#000000').fontSize(10).font('Helvetica');
          const textX = x + numberBoxWidth + 10;
          const textY = y + 5;

          doc.font('Helvetica-Bold').text(data.name || '', textX, textY);
          doc.font('Helvetica').text(data.companyName || '', textX, textY + 15);
          doc.text(data.phoneNumber || '', textX, textY + 30);
          doc.text(data.email || '', textX, textY + 45);
          doc.text(data.businessType || '', textX, textY + 60);

          // Add company logo and person's photo
          const imageSize = 40;
          const imageY = y + 5;
          if (data.logoUrl) {
            const logoPath = path.join(IMAGES_BASE_PATH, data.logoUrl);
            if (fs.existsSync(logoPath)) {
              doc.image(logoPath, pageWidth - margin - 2 * imageSize - 10, imageY, { width: imageSize, height: imageSize });
            }
          }
          if (data.photoUrl) {
            const photoPath = path.join(IMAGES_BASE_PATH, data.photoUrl);
            if (fs.existsSync(photoPath)) {
              doc.image(photoPath, pageWidth - margin - imageSize, imageY, { width: imageSize, height: imageSize });
            }
          }

          // Remove the thin line after the card
        };

        const addPage = () => {
          // Adjusted the size of the red banner at the top
          doc.rect(0, 0, pageWidth, topBannerHeight).fill('#FF0000');

          // Adjusted the white triangle in top-right corner
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
