import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export class DTO_RQ_LoginBMS {
  @IsString()
  @IsNotEmpty({ message: 'Username không được để trống' })
  @MinLength(3, { message: 'Username phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Username không được vượt quá 50 ký tự' })
  @Matches(/^[A-Za-z0-9._-]+$/, {
    message: 'Username chỉ được chứa chữ, số và các ký tự . _ -',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(100, { message: 'Password không được vượt quá 100 ký tự' })
  password: string;
}
export class DTO_RQ_LogoutBMS {
  @IsUUID()
  account_id: string;
}
