export class GeneratePdfDto {
  chapterName: string;
  location: string;
  memberSize: string;
  regionalRank: string;
  allIndiaRank: string;
  globalRank: string;
  members: {
    name: string;
    company: string;
    phone: string;
    email: string;
    category: string;
    logo: string; // base64-encoded string
    photo: string; // base64-encoded string
  }[];
}