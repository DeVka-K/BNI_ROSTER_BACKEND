// import { IEvent } from '@nestjs/cqrs';
// import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

// export class CsvConvertedEvent implements IEvent {
//   constructor(public readonly chapterData: ChapterData) {}
// }



import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

export class CsvConvertedEvent {
  constructor(public readonly chapterData: ChapterData) {}
}