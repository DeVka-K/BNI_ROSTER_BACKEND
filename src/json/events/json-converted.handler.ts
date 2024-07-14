import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { JsonConvertedEvent } from './json-converted.event';
import { PDFService } from '../../pdf/pdf.service';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(JsonConvertedEvent)
export class JsonConvertedHandler implements IEventHandler<JsonConvertedEvent> {
  constructor(private readonly pdfService: PDFService) {}

  async handle(event: JsonConvertedEvent) {
    const pdfId = uuidv4();
    const status="isjson"
    await this.pdfService.generatePDF(event.chapterData, pdfId,status);
  }
}
