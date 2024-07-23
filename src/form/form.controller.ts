
// import { Controller, Post, UseInterceptors, UploadedFiles, Body, Req, Res, Get, Param } from '@nestjs/common';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { FormService } from './form.service';
// import { Request, Response } from 'express';
// import { ChapterDataDto } from './dto/chapter-data.dto';

// // Configure storage
// const storage = diskStorage({
//   destination: './uploads/images',
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//   },
// });

// @Controller('form')
// export class FormController {
//   constructor(private readonly formService: FormService) {}
// public counts (){debugger;
//     console.log(storage);
    
// }
   
//   @Post('upload')
//   @UseInterceptors(FileFieldsInterceptor([
//     { name: 'chapterLogo', maxCount: 1 },

 
//     { name: 'membersphoto[0]', maxCount: 1 },
//     { name: 'memberscompanyLogo[0]', maxCount: 1 },
//     { name: 'membersphoto[1]', maxCount: 1 },
//     { name: 'memberscompanyLogo[1]', maxCount: 1 },
//     { name: 'membersphoto[2]', maxCount: 1 },
//     { name: 'memberscompanyLogo[2]', maxCount: 1 },
//     { name: 'membersphoto[3]', maxCount: 1 },
//     { name: 'memberscompanyLogo[3]', maxCount: 1 },
//     { name: 'membersphoto[4]', maxCount: 1 },
//     { name: 'memberscompanyLogo[4]', maxCount: 1 },
//     { name: 'membersphoto[5]', maxCount: 1 },
//     { name: 'memberscompanyLogo[5]', maxCount: 1 },
//     { name: 'membersphoto[6]', maxCount: 1 },
//     { name: 'memberscompanyLogo[6]', maxCount: 1 },
//     { name: 'membersphoto[7]', maxCount: 1 },
//     { name: 'memberscompanyLogo[7]', maxCount: 1 },
//     { name: 'membersphoto[8]', maxCount: 1 },
//     { name: 'memberscompanyLogo[8]', maxCount: 1 },
//     { name: 'membersphoto[9]', maxCount: 1 },
//     { name: 'memberscompanyLogo[9]', maxCount: 1 },

 
   
//     // Add similar entries for other members as needed
//   ], { storage }))
//   async uploadForm(
//     @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
//     @Body() body: any,
//     @Req() req: Request,
//     @Res() res: Response
//   ) {
//     try {
//       body.members = JSON.parse(body.members);
    
//       const result = await this.formService.create(body, files);
//       console.log("bd",result);
      
//       const previewUrl = `${req.protocol}://${req.get('host')}/form/preview/${result.pdfId}`;
//       const downloadUrl = `${req.protocol}://${req.get('host')}/form/download/${result.pdfId}`;
//       res.json({ message: 'Form submitted and processed successfully', pdfId: result.pdfId, previewUrl, downloadUrl });
//     } catch (error) {
//       res.status(500).json({ message: 'An error occurred while processing the form', error: error.message });
//     }
//   }

//   @Get('preview/:id')
//   async previewPDF(@Param('id') id: string, @Res() res: Response) {
//     try {
//       const pdfBuffer = await this.formService.getPDFBuffer(id);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
//       res.send(pdfBuffer);
//     } catch (error) {
//       if (error.message === 'PDF not found') {
//         res.status(404).json({ message: 'PDF not found' });
//       } else {
//         res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
//       }
//     }
//   }

//   @Get('download/:id')
//   async downloadPDF(@Param('id') id: string, @Res() res: Response) {
//     try {
//       const pdfBuffer = await this.formService.getPDFBuffer(id);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
//       res.send(pdfBuffer);
//     } catch (error) {
//       if (error.message === 'PDF not found') {
//         res.status(404).json({ message: 'PDF not found' });
//       } else {
//         res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
//       }
//     }
//   }
// }
 
import { Controller, Post, UseInterceptors, UploadedFiles, Body, Req, Res, Get, Param } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FormService } from './form.service';
import { Request, Response } from 'express';
import { ChapterDataDto } from './dto/chapter-data.dto';
 
// Configure storage
const storage = diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
 
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}
public counts (){debugger;
    console.log(storage);
   
}
   
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'chapterLogo', maxCount: 1 },
 
   
    ...Array.from({ length: 100 }).map((_, index) => ({ name: `membersphoto[${index}]`, maxCount: 1 })),
    ...Array.from({ length: 100 }).map((_, index) => ({ name: `memberscompanyLogo[${index}]`, maxCount: 1 })),
 
 
    // Add similar entries for other members as needed
  ], { storage }))
  async uploadForm(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      body.members = JSON.parse(body.members);
   
      const result = await this.formService.create(body, files);
     
      const previewUrl = `${req.protocol}://${req.get('host')}/form/preview/${result.pdfId}`;
      const downloadUrl = `${req.protocol}://${req.get('host')}/form/download/${result.pdfId}`;
      res.json({ message: 'Form submitted and processed successfully', pdfId: result.pdfId, previewUrl, downloadUrl });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while processing the form', error: error.message });
    }
  }
 
  @Get('preview/:id')
  async previewPDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.formService.getPDFBuffer(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      if (error.message === 'PDF not found') {
        res.status(404).json({ message: 'PDF not found' });
      } else {
        res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
      }
    }
  }
 
  @Get('download/:id')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.formService.getPDFBuffer(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      if (error.message === 'PDF not found') {
        res.status(404).json({ message: 'PDF not found' });
      } else {
        res.status(500).json({ message: 'An error occurred while retrieving the PDF', error: error.message });
      }
    }
  }
}
 
 

