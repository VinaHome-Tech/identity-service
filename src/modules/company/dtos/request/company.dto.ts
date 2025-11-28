import { 
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsNotEmpty 
} from 'class-validator';

export class DTO_RQ_Company {

  @IsBoolean()
  status: boolean;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  company_short_name: string;

  @IsString()
  @IsNotEmpty()
  tax_code: string;

  @IsString()
  @IsNotEmpty()
  business_license_number: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  legal_representative: string;

  @IsOptional()
  @IsString()
  head_office_address?: string;

  @IsString()
  @IsNotEmpty()
  company_code: string;

  @IsOptional()
  @IsString()
  url_logo?: string;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  bank_account_number?: string;

  @IsOptional()
  @IsString()
  bank_account_name?: string;
}
