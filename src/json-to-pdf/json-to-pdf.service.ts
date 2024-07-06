// src/json-to-pdf/json-to-pdf.service.ts
import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { JsonToPdfCreatedEvent } from './events/json-to-pdf-created.events';
import { GetJsonToPdfQuery } from './queries/get-json-to-pdf.query';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

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
        const doc = new PDFDocument();
        const filename = `output_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../../pdfs', filename);
        console.log('Creating PDF at:', filePath);
  
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
  
        // Add formatted content to PDF
        doc.fontSize(18).text('Business Card Information', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${jsonData.name}`);
        doc.text(`Company: ${jsonData.companyName}`);
        doc.text(`Phone: ${jsonData.phoneNumber}`);
        doc.text(`Email: ${jsonData.email}`);
        doc.text(`Business Type: ${jsonData.businessType}`);
        
        doc.end();
  
        writeStream.on('finish', () => {
          console.log('PDF creation finished');
          resolve(filename);  // Return just the filename, not the full path
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
