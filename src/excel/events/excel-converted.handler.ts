// import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { ExcelConvertedEvent } from './excel-converted.event';
// import { PDFService } from '../../pdf/pdf.service';

// @EventsHandler(ExcelConvertedEvent)
// export class ExcelConvertedHandler implements IEventHandler<ExcelConvertedEvent> {
//   constructor(private readonly pdfService: PDFService ) {}

//   async handle(event: ExcelConvertedEvent) {
//     await this.pdfService. generatePDF(event.chapterData);
//   }
// }


import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExcelConvertedEvent } from './excel-converted.event';
import { PDFService } from '../../pdf/pdf.service';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(ExcelConvertedEvent)
export class ExcelConvertedHandler implements IEventHandler<ExcelConvertedEvent> {
  constructor(private readonly pdfService: PDFService) {}

  async handle(event: ExcelConvertedEvent) {
    const pdfId = uuidv4();
    const status="isexcel"
    await this.pdfService.generatePDF(event.chapterData, pdfId,status);
  }
}
