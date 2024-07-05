import { AggregateRoot } from '@nestjs/cqrs';
import { ChapterCreatedEvent } from '../events/chapter-created.event';

export class Chapter extends AggregateRoot {
  constructor(private readonly data: any) {
    super();
    this.apply(new ChapterCreatedEvent(this.data.id));
  }

  getData() {
    return this.data;
  }
}