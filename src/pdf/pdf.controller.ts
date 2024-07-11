import { Controller, Post, Body, UseInterceptors, UploadedFiles, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'chapterLogo', maxCount: 1 },
    { name: 'members', maxCount: 50 }, // Adjust maxCount based on your needs
  ]))
    // Add more fields for additional members if needed
 
  async generatePdf(@Body() body, @UploadedFiles() files, @Res() res: Response) {
    try {
      const { chapterName, location, memberSize, regionalRank, allIndiaRank, globalRank } = body;
      const members = JSON.parse(body.members);

      // Process the uploaded files
      const chapterLogo = files.chapterLogo ? files.chapterLogo[0] : null;
      members.forEach((member, index) => {
        member.memberPhoto = files[`members[${index}][memberPhoto]`] ? files[`members[${index}][memberPhoto]`][0] : null;
        member.companyPhoto = files[`members[${index}][companyPhoto]`] ? files[`members[${index}][companyPhoto]`][0] : null;
      });

      // Generate the PDF
      const pdfPath = await this.pdfService.generatePdf(
        chapterName,
        location,
        memberSize,
        regionalRank,
        allIndiaRank,
        globalRank,
        members,
        chapterLogo
      );
      

      // Send the PDF to the client
      res.download(pdfPath, 'bni_roster.pdf', (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          throw new HttpException('Error sending PDF', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          console.log('PDF sent successfully');
          // Optionally, remove the PDF file after sending
          // fs.unlinkSync(pdfPath);
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException('Error generating PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
