import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class MemberDto {
  @IsString()
  name: string;

  @IsString()
  companyName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;
}

export class ChapterDataDto {
  @IsString()
  chapterName: string;

  @IsString()
  location: string;

  @IsNumber()
  memberSize: number;

  @IsNumber()
  regionalRank: number;

  @IsNumber()
  allIndiaRank: number;

  @IsNumber()
  globalRank: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}