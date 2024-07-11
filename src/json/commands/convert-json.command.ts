import { ICommand } from '@nestjs/cqrs';

export class ConvertJsonCommand implements ICommand {
  constructor(public readonly file: Express.Multer.File) {}
}
