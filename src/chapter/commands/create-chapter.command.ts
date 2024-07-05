import { CreateChapterDto } from "../dto/create-chapter.dto";

export class CreateChapterCommand {
  constructor(public readonly chapterData: CreateChapterDto) {}
}