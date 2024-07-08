// import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { CsvConvertedEvent } from './csv-converted.event';
// import { PDFService} from '../../pdf/pdf.service';

// @EventsHandler(CsvConvertedEvent)
// export class CsvConvertedHandler implements IEventHandler<CsvConvertedEvent> {
//   constructor(private readonly  PDFService:  PDFService) {}

//   async handle(event: CsvConvertedEvent) {
//     await this. PDFService.generatePDF(event.chapterData);
//   }
// }



import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CsvConvertedEvent } from './csv-converted.event';
import { PDFService } from '../../pdf/pdf.service';
import { v4 as uuidv4 } from 'uuid';
 
@EventsHandler(CsvConvertedEvent)
export class CsvConvertedHandler implements IEventHandler<CsvConvertedEvent> {
  constructor(private readonly pdfService: PDFService) {}
 
  async handle(event: CsvConvertedEvent) {
    const pdfId = uuidv4();
    await this.pdfService.generatePDF(event.chapterData, pdfId);
  }
}