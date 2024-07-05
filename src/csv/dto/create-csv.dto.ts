import { IsNotEmpty } from 'class-validator';

export class CreateCsvDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}