import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CsvConvertedEvent } from './csv-converted.event';
import { PDFService} from '../../pdf/pdf.service';

@EventsHandler(CsvConvertedEvent)
export class CsvConvertedHandler implements IEventHandler<CsvConvertedEvent> {
  constructor(private readonly  PDFService:  PDFService) {}

  async handle(event: CsvConvertedEvent) {
    await this. PDFService.generatePDF(event.chapterData);
  }
}