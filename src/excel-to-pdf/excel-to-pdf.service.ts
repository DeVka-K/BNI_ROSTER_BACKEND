// import { Injectable } from '@nestjs/common';
// import { ConvertExcelToPdfDto } from './dto/convert-excel-to-pdf.dto';
// import * as XLSX from 'xlsx';
// import * as PDFDocument from 'pdfkit';
// import axios from 'axios';

// @Injectable()
// export class ExcelToPdfService {
//   async convertExcelToPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
//     const workbook = XLSX.read(convertExcelToPdfDto.file, { type: 'buffer' });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     const pdfBuffer = await this.generatePdf(data);
//     return pdfBuffer;
//   }

//   async previewPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
//     // Similar to convertExcelToPdf, but return a preview version
//     // You might want to generate a smaller PDF or only the first page
//     return this.convertExcelToPdf(convertExcelToPdfDto);
//   }

//   private async generatePdf(data: any[]): Promise<Buffer> {
//     return new Promise((resolve) => {
//       const doc = new PDFDocument();
//       const buffers = [];
//       doc.on('data', buffers.push.bind(buffers));
//       doc.on('end', () => {
//         const pdfData = Buffer.concat(buffers);
//         resolve(pdfData);
//       });

//       // Generate PDF content based on the data
//       // This is a simplified example; you'll need to customize this based on your specific template
//       doc.fontSize(18).text('BNI Leaders 2024', { align: 'center' });
//       data.forEach((row, index) => {
//         doc.fontSize(12).text(`${index + 1}. ${row.name} - ${row.position}`);
//       });

//       doc.end();
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConvertExcelToPdfDto } from './dto/convert-excel-to-pdf.dto';
import * as XLSX from 'xlsx';
import * as PDFDocument from 'pdfkit';
import { Logger } from '@nestjs/common';

@Injectable()
export class ExcelToPdfService {
    private readonly logger = new Logger(ExcelToPdfService.name);

  async convertExcelToPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
    const workbook = XLSX.read(convertExcelToPdfDto.file, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const pdfBuffer = await this.generatePdf(data);
    return pdfBuffer;
  }

  async previewPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
    this.logger.log('Starting preview generation');
    try {
      const workbook = XLSX.read(convertExcelToPdfDto.file, { type: 'buffer' });
      this.logger.log('Excel file read successfully');
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      this.logger.log(`Extracted ${data.length} rows from Excel`);

      const previewData = data.slice(0, 10);
      const previewPdfBuffer = await this.generatePdf(previewData, true);
      this.logger.log('Preview PDF generated successfully');
      return previewPdfBuffer;
    } catch (error) {
      this.logger.error('Error in previewPdf', error.stack);
      throw error;
    }
  }

  // ... similar changes for the convertExcelToPdf method

  private async generatePdf(data: any[], isPreview: boolean = false): Promise<Buffer> {
    this.logger.log('Starting PDF generation');
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          this.logger.log('PDF generation completed');
          resolve(pdfData);
        });

        // Generate PDF content
        doc.fontSize(18).text('BNI Leaders 2024', { align: 'center' });
        if (isPreview) {
          doc.fontSize(10).text('Preview', { align: 'right' });
        }
        data.forEach((row, index) => {
          doc.fontSize(12).text(`${index + 1}. ${row.name} - ${row.position}`);
        });
        if (isPreview) {
          doc.addPage();
          doc.fontSize(12).text('...');
        }

        doc.end();
      } catch (error) {
        this.logger.error('Error in generatePdf', error.stack);
        reject(error);
      }
    });
  }
}