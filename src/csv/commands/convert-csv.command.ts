import { ICommand } from '@nestjs/cqrs';

export class ConvertCsvCommand implements ICommand {
  constructor(public readonly file: Express.Multer.File) {}
}