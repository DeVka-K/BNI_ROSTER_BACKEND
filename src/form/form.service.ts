
import { Injectable, Logger } from '@nestjs/common';
import { PDFService } from '../pdf/pdf.service';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ChapterData, MemberData } from '../shared/interfaces/chapter-data.interface';
import { ChapterDataDto } from './dto/chapter-data.dto';

@Injectable()
export class FormService {
  private readonly logger = new Logger(FormService.name);

  constructor(private readonly pdfService: PDFService) {}

  async create(data: ChapterDataDto, files: { [key: string]: Express.Multer.File[] }) {
    this.logger.log('Received data: ' + JSON.stringify(data));
    this.logger.log('Received files: ' + JSON.stringify(files));

    const chapterData: ChapterData = {
      chapterName: data.chapterName,
      location: data.location,
      memberSize: data.memberSize,
      regionalRank: data.regionalRank,
      allIndiaRank: data.allIndiaRank,
      globalRank: data.globalRank,
      chapterLogo: files['chapterLogo'] && files['chapterLogo'][0] ? files['chapterLogo'][0].path : null,
      members: []
    };
  
    this.logger.log('Initialized chapterData: ' + JSON.stringify(chapterData));

    if (Array.isArray(data.members)) {
      chapterData.members = data.members.map((member, index) => {
        const photoKey = `membersphoto[${index}]`;
        const companyLogoKey = `memberscompanyLogo[${index}]`;

        const memberData: MemberData = {
          name: member.name,
          companyName: member.companyName,
          email: member.email,
          phone: member.phone,
          category: member.category,
          photo: files[photoKey] && files[photoKey][0] ? files[photoKey][0].path : null,
          companyLogo: files[companyLogoKey] && files[companyLogoKey][0] ? files[companyLogoKey][0].path : null,
        };

        this.logger.log(`Processed member ${index}: ` + JSON.stringify(memberData));
        return memberData;
      });
    } else {
      this.logger.error('Data members is not an array: ' + JSON.stringify(data.members));
    }

    const pdfId = uuidv4();
    this.logger.log('Generated PDF ID: ' + pdfId);
    const status = "isform";
    this.logger.log("formstatus: " + status);

    try {
      await this.pdfService.generatePDF(chapterData, pdfId, status);
      this.logger.log('PDF generation successful');
      return { pdfId };
    } catch (error) {
      this.logger.error('Error during PDF generation: ' + error.message, error.stack);
      throw new Error('Error generating PDF');
    }
  }

  async getPDFBuffer(id: string): Promise<Buffer> {
    const pdfPath = path.resolve(`./uploads/${id}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF not found');
    }
    return fs.readFileSync(pdfPath);
  }
}
