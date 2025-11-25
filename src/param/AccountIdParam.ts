import { IsUUID } from 'class-validator';

export class AccountIdParam {
  @IsUUID()
  id: string;
}
