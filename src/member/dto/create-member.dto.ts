export class CreateMemberDto {
    name: string;
    company: string;
    email: string;
    phone: string;
    category: string;
    memberPhoto: string; // Base64 encoded image
    companyPhoto: string; // Base64 encoded image
  }