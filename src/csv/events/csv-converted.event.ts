



// import { PDFDict } from 'pdf-lib';
// import { ChapterData } from '../../shared/interfaces/chapter-data.interface';

// export class CsvConvertedEvent {
//   constructor(public readonly chapterData: ChapterData) {}

// }


import { ChapterData } from '../../shared/interfaces/chapter-data.interface';
 
export class CsvConvertedEvent {
  constructor(
    public readonly chapterData: ChapterData,
    public readonly pdfId: string
  ) {}
}