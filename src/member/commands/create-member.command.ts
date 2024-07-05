import { CreateMemberDto } from "../dto/create-member.dto";

export class CreateMemberCommand {
  constructor(public readonly memberData: CreateMemberDto) {}
}