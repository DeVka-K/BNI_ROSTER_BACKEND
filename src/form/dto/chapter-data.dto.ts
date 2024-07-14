import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
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

  @IsString()
  companyLogo: string;


  @IsString()
  photo: string;





}

export class ChapterDataDto {
  @IsString()
  chapterName: string;

  @IsString()
  location: string;

  @IsInt()
  memberSize: number;

  @IsInt()
  regionalRank: number;

  @IsInt()
  allIndiaRank: number;

  @IsInt()
  globalRank: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: any;
}

