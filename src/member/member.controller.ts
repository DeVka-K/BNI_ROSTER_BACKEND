import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateMemberCommand } from './commands/create-member.command';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.commandBus.execute(new CreateMemberCommand(createMemberDto));
  }
}