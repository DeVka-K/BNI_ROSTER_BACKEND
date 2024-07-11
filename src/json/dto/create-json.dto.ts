import { IsNotEmpty } from 'class-validator';
export class CreateJsonDto {
    @IsNotEmpty()
    file: Express.Multer.File;
  }