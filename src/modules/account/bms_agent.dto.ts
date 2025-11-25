import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CommissionAgent {
  @IsString()
  ticket_type: string;
  @IsInt()
  ticket_value: number;
  @IsString()
  goods_type: string;
  @IsInt()
  goods_value: number;
}
export class DTO_RQ_Agent {
  @IsInt()
  @IsOptional()
  id: number;
  @IsString()
  username: string;
  @IsString()
  @IsOptional()
  password: string;
  @IsString()
  phone: string;
  @IsString()
  @IsOptional()
  email: string;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  address: string;
  @IsBoolean()
  status: boolean;
  @ValidateNested()
  @Type(() => CommissionAgent)
  commission: CommissionAgent;
}
