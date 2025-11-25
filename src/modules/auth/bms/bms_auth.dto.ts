import { IsString, IsUUID } from 'class-validator';

export class DTO_RQ_LoginBMS {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
export class DTO_RQ_LogoutBMS {
  @IsUUID()
  account_id: string;
}
