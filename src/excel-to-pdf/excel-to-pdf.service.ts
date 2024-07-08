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
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import axios from 'axios';

@Injectable()
export class ExcelToPdfService {
  private readonly logger = new Logger(ExcelToPdfService.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async createPdf(excelFilePath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.log(`Starting PDF creation from Excel file: ${excelFilePath}`);
  
        // Check file permissions
        this.checkFileReadPermission(excelFilePath);
  
        // Check if file exists
        if (!fs.existsSync(excelFilePath)) {
          throw new Error(`Excel file not found at path: ${excelFilePath}`);
        }
  
        // Read the Excel file
        this.logger.log('Reading Excel file...');
        const workbook = XLSX.readFile(excelFilePath);
        this.logger.log('Excel file read successfully');
  
        if (workbook.SheetNames.length === 0) {
          throw new Error('Excel file has no sheets');
        }
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // Convert the worksheet to an array of objects
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];
  
        // Create PDF document
        this.logger.log('Creating PDF document...');
        const doc = new PDFDocument({ size: 'A4' });
        const filename = `output_${Date.now()}.pdf`;
        const pdfDir = path.join(process.cwd(), 'pdfs');
  
        // Create the directory if it doesn't exist
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }
  
        const filePath = path.join(pdfDir, filename);
        this.logger.log(`Creating PDF at: ${filePath}`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
  
        // Loop through data and add business cards
        for (let i = 0; i < data.length; i += 7) {
          if (i > 0) {
            doc.addPage(); // Add new page for each set of 7 cards after the first set
          }
          for (let j = i; j < Math.min(i + 7, data.length); j++) {
            await this.addBusinessCard(doc, data[j], 50, (j % 7) * 120); // Adjust Y position based on card index
          }
        }
  
        // Finalize PDF document
        doc.end();
  
        // Handle stream events
        writeStream.on('finish', () => {
          this.logger.log('PDF creation finished');
          resolve(filename);
        });
  
        writeStream.on('error', (error) => {
          this.logger.error('Error writing PDF:', error);
          reject(error);
        });
  
      } catch (error) {
        this.logger.error('Error in createPdf:', error);
        reject(error);
      }
    });
  }
  
  private async addBusinessCard(doc: PDFKit.PDFDocument, data: any, x: number, y: number) {
    // Add business card content
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${data.name || data.Name || 'N/A'}`, x, y);
    doc.text(`Company: ${data.companyName || data.Company || data['Company Name'] || 'N/A'}`, x, y + 20);
    doc.text(`Phone: ${data.phoneNumber || data.Phone || data['Phone Number'] || 'N/A'}`, x, y + 40);
    doc.text(`Email: ${data.email || data.Email || 'N/A'}`, x, y + 60);
    doc.text(`Business Type: ${data.businessType || data['Business Type'] || 'N/A'}`, x, y + 80);
  
    // Add images if available
    
    await this.addImage(doc, data.logoUrl, x + 200, y);
    await this.addImage(doc, data.photoUrl, x + 300, y); 

    doc.moveDown(2);
  }
  
  private async addImage(doc: PDFKit.PDFDocument, imageUrl: string, x: number, y: number) {
    // Add image logic
    if (!imageUrl) {
      this.logger.log('No image URL provided');
      return;
    }
  
    let imagePath = imageUrl;
    if (!fs.existsSync(imageUrl)) {
      // Download image if it's a URL
      try {
        this.logger.log(`Downloading image from URL: ${imageUrl}`);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        imagePath = path.join(process.cwd(), 'images', path.basename(imageUrl));
        fs.writeFileSync(imagePath, imageBuffer);
        this.logger.log(`Downloaded image to: ${imagePath}`);
      } catch (error) {
        this.logger.error(`Error downloading image: ${error.message}`);
        return;
      }
    }
  
    // Add image to PDF document
    if (this.isSupportedImageFormat(imagePath)) {
      try {
        doc.image(imagePath, x, y, { width: 80, height: 80 });
        this.logger.log(`Image added successfully: ${imagePath}`);
      } catch (error) {
        this.logger.error(`Error adding image: ${error.message}`);
      }
    } else {
      this.logger.warn(`Unsupported image format: ${imagePath}`);
    }
  }
  
  private checkFileReadPermission(filePath: string): boolean {
    // Check file read permissions
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      this.logger.log(`File ${filePath} is readable`);
      return true;
    } catch (err) {
      this.logger.error(`No read access to file ${filePath}:`, err);
      return false;
    }
  }
  
  private isSupportedImageFormat(filePath: string): boolean {
    // Check if image format is supported
    const ext = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  }
}
  