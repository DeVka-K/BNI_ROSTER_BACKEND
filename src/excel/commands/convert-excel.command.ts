// import { ICommand } from '@nestjs/cqrs';

// export class ConvertExcelCommand implements ICommand {
//   constructor(public readonly excelContent: string) {}
// }


import { ICommand } from '@nestjs/cqrs';

export class ConvertExcelCommand implements ICommand {
  constructor(public readonly file: Express.Multer.File) {}
}
