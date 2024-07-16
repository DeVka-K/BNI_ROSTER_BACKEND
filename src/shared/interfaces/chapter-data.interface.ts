export interface ChapterData {
    chapterName: string;
    location: string;
    memberSize: number;
    regionalRank: number;
    allIndiaRank: number;
    globalRank: number;
    chapterLogo: string;
    members:any;
  }
  
  export interface MemberData {
    name: string;
    companyName: string;
    email: string;
    phone: string;
    category: string;
    photo: string;
    companyLogo: string;
  }