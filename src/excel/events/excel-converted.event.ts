// import { IEvent } from '@nestjs/cqrs';
// import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

// export class ExcelConvertedEvent implements IEvent {
//   constructor(public readonly chapterData: ChapterData) {}
// }


import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

export class ExcelConvertedEvent {
  constructor(
    public readonly chapterData: ChapterData,
    public readonly pdfId: string
  ) {}
}
