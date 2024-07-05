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

@Injectable()
export class ExcelToPdfService {
  async convertExcelToPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
    const workbook = XLSX.read(convertExcelToPdfDto.file, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const pdfBuffer = await this.generatePdf(data);
    return pdfBuffer;
  }

  async previewPdf(convertExcelToPdfDto: ConvertExcelToPdfDto): Promise<Buffer> {
    const workbook = XLSX.read(convertExcelToPdfDto.file, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Generate a preview version of the PDF
    const previewData = data.slice(0, 10); // For example, only use the first 10 rows
    const previewPdfBuffer = await this.generatePdf(previewData, true);
    return previewPdfBuffer;
  }

  private async generatePdf(data: any[], isPreview: boolean = false): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Generate PDF content based on the data
      doc.fontSize(18).text('BNI Leaders 2024', { align: 'center' });

      // If it's a preview, add a watermark or indication it's a preview
      if (isPreview) {
        doc.fontSize(10).text('Preview', { align: 'right' });
      }

      data.forEach((row, index) => {
        doc.fontSize(12).text(`${index + 1}. ${row.name} - ${row.position}`);
      });

      // If it's a preview, you might want to only generate part of the content
      if (isPreview) {
        doc.addPage();
        doc.fontSize(12).text('...'); // Indicate that this is just a preview
      }

      doc.end();
    });
  }
}
