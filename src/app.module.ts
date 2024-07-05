import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExcelToPdfModule } from './excel-to-pdf/excel-to-pdf.module';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';

@Module({
  imports: [
    ExcelToPdfModule,
    ApiGatewayModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class AppModule {}
