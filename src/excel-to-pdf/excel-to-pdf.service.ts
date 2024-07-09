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
// import { Injectable, Logger } from '@nestjs/common';
// import { QueryBus, CommandBus } from '@nestjs/cqrs';
// import * as PDFDocument from 'pdfkit';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// @Injectable()
// export class ExcelToPdfService {
//   private readonly logger = new Logger(ExcelToPdfService.name);

//   constructor(
//     private readonly queryBus: QueryBus,
//     private readonly commandBus: CommandBus
//   ) {}

//   async createPdf(excelFilePath: string): Promise<string> {
//     return new Promise(async (resolve, reject) => {
//       try {
//         this.logger.log(`Starting PDF creation from Excel file: ${excelFilePath}`);
  
//         // Check file permissions
//         this.checkFileReadPermission(excelFilePath);
  
//         // Check if file exists
//         if (!fs.existsSync(excelFilePath)) {
//           throw new Error(`Excel file not found at path: ${excelFilePath}`);
//         }
  
//         // Read the Excel file
//         this.logger.log('Reading Excel file...');
//         const workbook = XLSX.readFile(excelFilePath);
//         this.logger.log('Excel file read successfully');
  
//         if (workbook.SheetNames.length === 0) {
//           throw new Error('Excel file has no sheets');
//         }
  
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
  
//         // Convert the worksheet to an array of objects
//         const data = XLSX.utils.sheet_to_json(worksheet) as any[];
  
//         // Create PDF document
//         this.logger.log('Creating PDF document...');
//         const doc = new PDFDocument({ size: 'A4' });
//         const filename = `output_${Date.now()}.pdf`;
//         const pdfDir = path.join(process.cwd(), 'pdfs');
  
//         // Create the directory if it doesn't exist
//         if (!fs.existsSync(pdfDir)) {
//           fs.mkdirSync(pdfDir, { recursive: true });
//         }
  
//         const filePath = path.join(pdfDir, filename);
//         this.logger.log(`Creating PDF at: ${filePath}`);
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);
  
//        // Loop through data and add business cards
//        for (let i = 0; i < data.length; i++) {
//         if (i % 6 === 0 && i > 0) {
//           doc.addPage(); // Add new page for each set of 6 cards after the first set
//         }
//         const y = (i % 6) * 120;
//         await this.addBusinessCard(doc, data[i], 50, y); // Adjust Y position based on card index
//       }

//       // Finalize PDF document
//       doc.end();
  
//         // Handle stream events
//         writeStream.on('finish', () => {
//           this.logger.log('PDF creation finished');
//           resolve(filename);
//         });
  
//         writeStream.on('error', (error) => {
//           this.logger.error('Error writing PDF:', error);
//           reject(error);
//         });
  
//       } catch (error) {
//         this.logger.error('Error in createPdf:', error);
//         reject(error);
//       }
//     });
//   }
  
//   private async addBusinessCard(doc: PDFKit.PDFDocument, data: any, x: number, y: number) {
//     // Add business card content
//     doc.fontSize(10).font('Helvetica');
//     doc.text(`Name: ${data.name || data.Name || 'N/A'}`, x, y);
//     doc.text(`Company: ${data.companyName || data.Company || data['Company Name'] || 'N/A'}`, x, y + 20);
//     doc.text(`Phone: ${data.phoneNumber || data.Phone || data['Phone Number'] || 'N/A'}`, x, y + 40);
//     doc.text(`Email: ${data.email || data.Email || 'N/A'}`, x, y + 60);
//     doc.text(`Business Type: ${data.businessType || data['Business Type'] || 'N/A'}`, x, y + 80);
  
//     // Add images if available
//     await this.addImage(doc, data.LogoUrl, x + 200, y);
//     await this.addImage(doc, data.PhotoUrl, x + 300, y); 
//   }
  
//   private async addImage(doc: PDFKit.PDFDocument, imageUrl: string, x: number, y: number) {
//     // Add image logic
//     if (!imageUrl) {
//       this.logger.log('No image URL provided');
//       return;
//     }
  
//     let imagePath = imageUrl;
//     if (!fs.existsSync(imageUrl)) {
//       // Download image if it's a URL
//       try {
//         this.logger.log(`Downloading image from URL: ${imageUrl}`);
//         const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//         const imageBuffer = Buffer.from(response.data, 'binary');
//         imagePath = path.join(process.cwd(), 'images', path.basename(imageUrl));
//         fs.writeFileSync(imagePath, imageBuffer);
//         this.logger.log(`Downloaded image to: ${imagePath}`);
//       } catch (error) {
//         this.logger.error(`Error downloading image: ${error.message}`);
//         return;
//       }
//     }
  
//     // Add image to PDF document
//     if (this.isSupportedImageFormat(imagePath)) {
//       try {
//         doc.image(imagePath, x, y, { width: 80, height: 80 });
//         this.logger.log(`Image added successfully: ${imagePath}`);
//       } catch (error) {
//         this.logger.error(`Error adding image: ${error.message}`);
//       }
//     } else {
//       this.logger.warn(`Unsupported image format: ${imagePath}`);
//     }
//   }
  
//   private checkFileReadPermission(filePath: string): boolean {
//     // Check file read permissions
//     try {
//       fs.accessSync(filePath, fs.constants.R_OK);
//       this.logger.log(`File ${filePath} is readable`);
//       return true;
//     } catch (err) {
//       this.logger.error(`No read access to file ${filePath}:`, err);
//       return false;
//     }
//   }
  
//   private isSupportedImageFormat(filePath: string): boolean {
//     // Check if image format is supported
//     const ext = path.extname(filePath).toLowerCase();
//     return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
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
        const doc = new PDFDocument({ size: 'A4', margin: 20 });
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
        // Inside createPdf method
for (let i = 0; i < data.length; i++) {
  if (i > 0 && i % 6 === 0) {
    doc.addPage(); // Add new page after every 6 cards
  }
  const y = (i % 6) * 140 + 20; // Increased spacing between cards
  await this.addBusinessCard(doc, data[i], i + 1, 20, y);
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
  private async addBusinessCard(doc: PDFKit.PDFDocument, data: any, index: number, x: number, y: number) {
    doc.save();
    doc.translate(x, y);
  
    // Define the y-coordinate for alignment
    const contentY = 20; // Align all elements vertically at this y-coordinate
    const lineHeight = 20; // Line height for consistent spacing
  
    // Add dark red rectangle for index (aligned with logo)
    doc.fillColor('#8B0000').rect(0, contentY, 60, 60).fill(); // Start height at contentY
  
    // Add index number (aligned with logo)
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold')
      .text(index.toString(), 15, contentY + 15, { width: 30, align: 'center' }); // Adjusted position to contentY
  
    // Add main content
    doc.fillColor('black').fontSize(12).font('Helvetica');
    doc.fontSize(16).font('Helvetica-Bold').text(data.Name || 'N/A', 70, contentY);
    doc.fontSize(12).font('Helvetica').text(data.Company || data['Company Name'] || 'N/A', 70, contentY + lineHeight);
    doc.text(data.Phone || data['Phone Number'] || 'N/A', 70, contentY + 2 * lineHeight);
    doc.text(data.Email || 'N/A', 70, contentY + 3 * lineHeight);
    doc.text(data['Business Type'] || 'IT', 70, contentY + 4 * lineHeight);
  
    // Add logo and photo to the right of the data
    await this.addImage(doc, data.LogoUrl, 200, contentY, 60, 60); // Position logo at x=200, y=contentY
    await this.addImage(doc, data.PhotoUrl, 290, contentY, 90, 90); // Position photo at x=290, y=contentY
  
    // Add horizontal lines (moved to start after the photo and reduced length)
    doc.strokeColor('#000000');
    for (let i = 1; i <= 4; i++) {
      doc.moveTo(400, contentY + i * lineHeight).lineTo(530, contentY + i * lineHeight).stroke(); // Moved start point to 400, length to 130
    }
  
    doc.restore();
}





  private async addImage(doc: PDFKit.PDFDocument, imageUrl: string, x: number, y: number, width: number, height: number) {
    if (!imageUrl) {
      this.logger.log('No image URL provided');
      return;
    }

    let imagePath = imageUrl;
    if (!fs.existsSync(imageUrl)) {
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

    if (this.isSupportedImageFormat(imagePath)) {
      try {
        doc.image(imagePath, x, y, { width, height });
        this.logger.log(`Image added successfully: ${imagePath}`);
      } catch (error) {
        this.logger.error(`Error adding image: ${error.message}`);
      }
    } else {
      this.logger.warn(`Unsupported image format: ${imagePath}`);
    }
  }
  //   // Add image to PDF document
  //   if (this.isSupportedImageFormat(imagePath)) {
  //     try {
  //       doc.image(imagePath, x, y, { width: 80, height: 80 });
  //       this.logger.log(`Image added successfully: ${imagePath}`);
  //     } catch (error) {
  //       this.logger.error(`Error adding image: ${error.message}`);
  //     }
  //   } else {
  //     this.logger.warn(`Unsupported image format: ${imagePath}`);
  //   }
  // }
  
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

