// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


// import { Module } from '@nestjs/common';
// import { CsvModule } from './csv/csv.module';
// import { PdfModule } from './pdf/pdf.module';
// import {  ExcelModule } from './excel/excel.module';
// import { JsonModule  } from './json/json.module';
// import { FormModule} from './form/form.module';


// @Module({
//   imports: [CsvModule, PdfModule,ExcelModule, JsonModule,FormModule],
//   // imports: [ExcelModule, PdfModule,],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { CsvModule } from './csv/csv.module';
import { PdfModule } from './pdf/pdf.module';
import { ExcelModule } from './excel/excel.module';
import { JsonModule } from './json/json.module';
import { FormModule } from './form/form.module';
import { AppController } from './app.controller';  // Add this line
import { AppService } from './app.service';  // Add this line

@Module({
  imports: [CsvModule, PdfModule, ExcelModule, JsonModule, FormModule],
  controllers: [AppController],  // Add this line
  providers: [AppService],  // Add this line
})
export class AppModule {}
