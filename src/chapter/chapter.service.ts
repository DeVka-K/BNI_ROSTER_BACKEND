import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create(chapterData: any) {
    const chapter = new Chapter(chapterData);
    this.eventPublisher.mergeObjectContext(chapter);
    chapter.commit();
    return chapter;
  }
}