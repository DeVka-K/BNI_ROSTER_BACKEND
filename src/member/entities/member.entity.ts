import { AggregateRoot } from '@nestjs/cqrs';
import { MemberCreatedEvent } from '../events/member-created.event';

export class Member extends AggregateRoot {
  constructor(private readonly data: any) {
    super();
    this.apply(new MemberCreatedEvent(this.data.id));
  }

  getData() {
    return this.data;
  }
}