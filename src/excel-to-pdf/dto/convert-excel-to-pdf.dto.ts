import { IsNotEmpty } from 'class-validator';

export class ConvertExcelToPdfDto {
  @IsNotEmpty()
  file: Buffer;

  @IsNotEmpty()
  filename: string;
}
