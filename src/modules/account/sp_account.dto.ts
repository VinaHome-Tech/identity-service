import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

class DTO_RQ_AcceptApp {
  @IsBoolean()
  bms: boolean;

  @IsBoolean()
  cms: boolean;

  @IsBoolean()
  ams: boolean;

  @IsBoolean()
  driver: boolean;
}
export class DTO_RQ_AdminAccount {
  @IsUUID()
  @IsNotEmpty({ message: 'Dữ liệu công ty không được để trống' })
  company_id: string;

  @IsString()
  @Length(4, 50, { message: 'Tên tài khoản phải từ 4–50 ký tự' })
  username: string;

  @IsString()
  @Length(6, 100, { message: 'Mật khẩu phải từ 6–100 ký tự' })
  password: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @Length(9, 15, { message: 'Số điện thoại phải từ 9–15 ký tự' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString(
    {},
    { message: 'Ngày sinh phải là định dạng ngày hợp lệ (YYYY-MM-DD)' },
  )
  @IsOptional()
  date_of_birth: Date;

  @IsInt()
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: number;

  @IsString()
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  role: string;

  @IsBoolean()
  status: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => DTO_RQ_AcceptApp)
  acceptApp: DTO_RQ_AcceptApp;
}
export class DTO_RP_AcceptApp {
  @Expose()
  bms: boolean;

  @Expose()
  cms: boolean;

  @Expose()
  ams: boolean;

  @Expose()
  driver: boolean;
}

export class DTO_RP_AdminAccount {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  name: string;
  @Expose()
  address: string;
  @Expose()
  date_of_birth: Date;
  @Expose()
  gender: string;
  @Expose()
  role: string;
  @Expose()
  status: boolean;
  @Expose()
  acceptApp: DTO_RP_AcceptApp;
}
