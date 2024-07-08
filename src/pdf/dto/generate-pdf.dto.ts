export class GeneratePdfDto {
    chapterName: string;
    location: string;
    memberSize: string;
    regionalRank: string;
    allIndiaRank: string;
    globalRank: string;
    members: {
      id: number;
      name: string;
      company: string;
      email: string;
      phone: string;
      category: string;
    }[];
  }