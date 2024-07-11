// import { IsString, IsNotEmpty } from 'class-validator';

// export class CreateExcelDto {
//   @IsString()
//   @IsNotEmpty()
//   excelContent: string; // Base64 encoded Excel file
// }


import { IsNotEmpty } from 'class-validator';

export class CreateExcelDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}
