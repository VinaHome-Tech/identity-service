import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
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
  gender: string;
  @IsString()
  role: string;
  @IsBoolean()
  status: boolean;
  @ValidateNested()
  @Type(() => DTO_Accept_App)
  accept_app: DTO_Accept_App;
}
