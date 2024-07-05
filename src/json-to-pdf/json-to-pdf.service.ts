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
        const filePath = path.join(__dirname, '../../../pdfs', `output_${Date.now()}.pdf`);
        console.log('Creating PDF at:', filePath);
  
        // Ensure the directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
  
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
  
        // Add content to PDF (customize this part based on your JSON structure)
        doc.text(JSON.stringify(jsonData, null, 2));
        
        doc.end();
  
        writeStream.on('finish', () => {
          console.log('PDF creation finished');
          resolve(filePath);
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
