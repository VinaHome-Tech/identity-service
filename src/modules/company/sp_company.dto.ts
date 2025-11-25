import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DTO_RQ_Company {
  @IsString()
  company_name: string;
  @IsString()
  company_short_name: string;
  @IsString()
  @IsOptional()
  tax_code: string;
  @IsString()
  @IsOptional()
  business_license_number: string;
  @IsString()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  legal_representative: string;
  @IsString()
  @IsOptional()
  head_office_address: string;
  @IsBoolean()
  status: boolean;
  @IsString()
  company_code: string;
  @IsString()
  @IsOptional()
  url_logo: string;
  @IsString()
  @IsOptional()
  bank_name: string;
  @IsString()
  @IsOptional()
  bank_account_number: string;
  @IsString()
  @IsOptional()
  bank_account_name: string;
}

export class DTO_RP_Company {
  @Expose()
  id: string;
  @Expose()
  company_name: string;
  company_short_name: string;
  tax_code: string;
  business_license_number: string;
  email: string;
  phone: string;
  legal_representative: string;
  head_office_address: string;
  status: boolean;
  company_code: string;
  url_logo: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  @Expose()
  created_at: Date;
}
