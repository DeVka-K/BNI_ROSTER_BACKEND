// src/pdf/dto/generate-pdf.dto.ts
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MemberDto {
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

  // We don't validate files here as they're handled separately
  memberPhoto?: any;
  companyPhoto?: any;
}

export class GeneratePdfDto {
  @IsString()
  chapterName: string;

  @IsString()
  location: string;

  @IsString()
  memberSize: string;

  @IsString()
  regionalRank: string;

  @IsString()
  allIndiaRank: string;

  @IsString()
  globalRank: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];

  // We don't validate chapterLogo here as it's handled separately
  chapterLogo?: any;
}