import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DTO_Accept_App {
  @IsBoolean()
  bms: boolean;
  @IsBoolean()
  cms: boolean;
  @IsBoolean()
  ams: boolean;
  @IsBoolean()
  driver: boolean;
}

export class DTO_RQ_Account {
  @IsString()
  @IsOptional()
  id: string;
  @IsString()
  username: string;
  @IsString()
  @IsOptional()
  password: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  email: string;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  address: string;
  @IsDateString()
  @IsOptional()
  date_of_birth: Date;
  @IsInt()
  @IsOptional()
  gender: number;
  @IsString()
  role: string;
  @IsBoolean()
  status: boolean;
  @ValidateNested()
  @Type(() => DTO_Accept_App)
  accept_app: DTO_Accept_App;
}


export class DTO_RQ_AccountInfo {

  @IsString({ message: 'Họ và tên phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Họ và tên phải có ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Họ và tên không được vượt quá 50 ký tự' })
  name: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi số' })
  @Matches(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone: string;

  
  @IsString({ message: 'Email phải là chuỗi ký tự' })
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ (định dạng YYYY-MM-DD)' })
  date_of_birth?: Date;

  @IsOptional()
  @IsInt({ message: 'Giới tính không hợp lệ' })
  @Min(1, { message: 'Giới tính không hợp lệ' })
  @Max(3, { message: 'Giới tính không hợp lệ' })
  gender?: number;
}

export class DTO_RQ_ChangePassword {
  @IsString()
  @MinLength(8, { message: 'Mật khẩu cũ phải có ít nhất 8 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu cũ không được vượt quá 50 ký tự' })
  old_password: string;
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu mới không được vượt quá 50 ký tự' })
  new_password: string;
}