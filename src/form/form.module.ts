// import { Module } from '@nestjs/common';
// import { FormController } from './form.controller';
// import { FormService } from './form.service';
// import { PdfModule } from '../pdf/pdf.module';
// import { MulterModule } from '@nestjs/platform-express';

// @Module({
//   imports: [
//     PdfModule,
//     MulterModule.register({
//       dest: './uploads',
//     }),
//   ],
//   controllers: [FormController],
//   providers: [FormService],
// })
// export class FormModule {}



import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { PdfModule } from '../pdf/pdf.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    PdfModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
