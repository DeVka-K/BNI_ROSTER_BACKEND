


import { Injectable, Logger } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import axios from 'axios';
import * as https from 'https';

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
        const doc = new PDFDocument({ size: 'A4', margin: 20 });
        const filename = `output_${Date.now()}.pdf`;
        const pdfDir = path.join(process.cwd(), 'pdfs');

        // Create the directory if it doesn't exist
        if (!fs.existsSync(pdfDir)) {
          fs.mkdirSync(pdfDir, { recursive: true });
        }
  
       const filePath = path.join(pdfDir, filename);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
  
        // Add first page with chapter information
        await this.addFirstPage(doc, data[0]);
  
        // Loop through data and add business cards
        for (let i = 0; i < data.length; i++) {
          if (i % 6 === 0) {
            doc.addPage();
            this.addBackgroundToPage(doc);
          }
          const y = (i % 6) * 140 + 20;
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

  private  async addFirstPage(doc: PDFKit.PDFDocument, data: any) {
    this.addFirstPageBackground(doc);
    
    const centerX = doc.page.width / 2;
  
    // Add chapter logo
    await this.addImage(doc, data['ChapterLogo'] || '', centerX - 50, 420, 100, 100);

    // Add BNI logo
    await this.addImage(doc, 'src/assets/bni_logo.png', centerX - 80, 300, 180, 100);

    doc.fontSize(24).font('Helvetica-Bold').text(data['ChapterName'] || 'N/A', centerX - 280, 550, { align: 'center' });
doc.fontSize(14).font('Helvetica');


    
    // Bottom information
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
      addCell(data.Location, 'Location', 0, statsYPosition, cellWidth);
      addCell(data.MemberSize, 'Members', cellWidth, statsYPosition, cellWidth);
      addCell(data.RegionalRank, 'Regional Rank', cellWidth * 2, statsYPosition, cellWidth);
      addCell(data.AllIndiaRank, 'All India Rank', cellWidth * 3, statsYPosition, cellWidth);
      addCell(data.GlobalRank, 'Global Rank', cellWidth * 4, statsYPosition, cellWidth);
    } catch (error) {
      console.error("Error adding cells to PDF:", error);
    }
  }

  private addFirstPageBackground(doc: PDFKit.PDFDocument) {
    // Add the background image for the first page
    doc.image('src/assets/first_page_background.png', 0, 0, {
      width: doc.page.width,
      height: doc.page.height
    });
  }

  private addBackgroundToPage(doc: PDFKit.PDFDocument) {
    // Add the background image for subsequent pages
    doc.image('src/assets/template.png', 0, 0, {
      width: doc.page.width,
      height: doc.page.height
    });
  }
  private async addBusinessCard(doc: PDFKit.PDFDocument, data: any, index: number, x: number, y: number) {
    doc.save();
    doc.translate(x, y);
  
    const contentY = 20;
    const lineHeight = 20;

    
    // Add white rectangle as background for the business card
    doc.fillColor('white').rect(0, 0, 545, 130).fill();
  
  
    // Add dark red rectangle for index (aligned with logo)
    doc.fillColor('#8B0000').rect(0, contentY, 40, 40).fill();
  
    // Add index number (aligned with logo)
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold')
      .text(index.toString(), 6, contentY + 15, { width: 30, align: 'center' });
  
    // Add main content
    doc.fillColor('black').fontSize(12).font('Helvetica');
    doc.fontSize(16).font('Helvetica-Bold').text(data.Name || 'N/A', 55, contentY);
    doc.fontSize(12).font('Helvetica').text(data.Company || data['Company Name'] || 'N/A', 55, contentY + lineHeight);
    doc.text(data.Phone || data['Phone Number'] || 'N/A', 55, contentY + 2 * lineHeight);
    doc.text(data.Email || 'N/A', 55, contentY + 3 * lineHeight);
    doc.text(data['Business Type'] || 'IT', 55, contentY + 4 * lineHeight);
  
    // Add logo and photo to the right of the data
    await this.addImage(doc, data.LogoUrl, 200, contentY, 60, 60);
    await this.addImage(doc, data.PhotoUrl, 290, contentY, 90, 90);
  
    // Add horizontal lines
    doc.strokeColor('#cccccc');
    for (let i = 1; i <= 4; i++) {
      doc.moveTo(400, contentY + i * lineHeight).lineTo(530, contentY + i * lineHeight).stroke();
    }
  
    doc.restore();
  }


  private async addImage(doc: PDFKit.PDFDocument, imageUrl: string, x: number, y: number, width: number, height: number) {
    if (!imageUrl) {
      this.logger.log('No image URL provided');
      return;
    }
  
    try {
      let imageBuffer: Buffer;
  
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        // For web URLs
        imageBuffer = await new Promise((resolve, reject) => {
          const request = https.get(imageUrl, { rejectUnauthorized: false }, (response) => {
            const data: any[] = [];
            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => resolve(Buffer.concat(data)));
          });
          request.on('error', reject);
        });
      } else if (fs.existsSync(imageUrl)) {
        // For local file paths
        imageBuffer = fs.readFileSync(imageUrl);
      } else {
        throw new Error(`Invalid image path or URL: ${imageUrl}`);
      }
  
      doc.image(imageBuffer, x, y, { width, height });
      this.logger.log(`Image added successfully from: ${imageUrl}`);
    } catch (error) {
      this.logger.error(`Error adding image from ${imageUrl}: ${error.message}`);
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