// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { CsvModule } from './csv/csv.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [CsvModule, PdfModule,],
})
export class AppModule {}
