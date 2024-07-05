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
    const event = new JsonToPdfCreatedEvent(jsonData);
    // Generate PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../../../pdfs', 'output.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    // Add content to PDF (customize this part based on your JSON structure)
    doc.text(JSON.stringify(jsonData, null, 2));
    
    doc.end();

    // Return the file path or URL for preview
    return filePath;
  }
}
