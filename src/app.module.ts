// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
 
import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [PdfModule],
})
export class AppModule {}

