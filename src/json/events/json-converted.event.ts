import { IEvent } from '@nestjs/cqrs';
import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

export class JsonConvertedEvent implements IEvent {
  constructor(
    public readonly chapterData: ChapterData,
    public readonly pdfId: string,
  ) {}
}
