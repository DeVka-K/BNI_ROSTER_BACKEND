import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ConvertJsonCommand } from './convert-json.command';
import { JsonConvertedEvent } from '../events/json-converted.event';
import { ChapterData } from '../../shared/interfaces/chapter-data.interface';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(ConvertJsonCommand)
export class ConvertJsonHandler implements ICommandHandler<ConvertJsonCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: ConvertJsonCommand): Promise<void> {
    const chapterData = this.parseJson(command.file);
    const pdfId = uuidv4(); // Generate a new UUID for the PDF
    this.eventBus.publish(new JsonConvertedEvent(chapterData, pdfId));
  }

  private parseJson(file: Express.Multer.File): ChapterData {
    const jsonData = JSON.parse(file.buffer.toString());

    // Ensure jsonData conforms to ChapterData structure
    const chapterData: ChapterData = {
      chapterName: jsonData.chapterName || '',
      location: jsonData.location || '',
      memberSize: jsonData.memberSize || 0,
      regionalRank: jsonData.regionalRank || 0,
      allIndiaRank: jsonData.allIndiaRank || 0,
      globalRank: jsonData.globalRank || 0,
      chapterLogo: jsonData.chapterLogo || '',
      members: jsonData.members || [],
    };

    return chapterData;
  }
}
