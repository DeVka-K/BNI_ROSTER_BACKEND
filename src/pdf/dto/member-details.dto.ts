import { IsNumber, IsString, IsBase64 } from 'class-validator';

export class MemberDetailsDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  company: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  category: string;

  @IsBase64()
  memberPhoto: string;

  @IsBase64()
  companyPhoto: string;
}