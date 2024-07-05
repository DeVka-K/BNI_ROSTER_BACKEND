import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChapterCommand } from './commands/create-chapter.command';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto) {
    return this.commandBus.execute(new CreateChapterCommand(createChapterDto));
  }
}