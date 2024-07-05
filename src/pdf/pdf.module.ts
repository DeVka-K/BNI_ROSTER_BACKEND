import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { ChapterModule } from '../chapter/chapter.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [ChapterModule, MemberModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}