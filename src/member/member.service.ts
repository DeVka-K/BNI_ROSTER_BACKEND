import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Member } from './entities/member.entity'; 

@Injectable()
export class MemberService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create(memberData: any) {
    const member = new Member(memberData);
    this.eventPublisher.mergeObjectContext(member);
    member.commit();
    return member;
  }
}