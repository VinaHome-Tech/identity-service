import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('tbl_company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  company_name: string;
  @Column()
  company_short_name: string;
  @Column()
  tax_code: string;
  @Column()
  business_license_number: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  legal_representative: string;
  @Column()
  head_office_address: string;
  @Column()
  status: boolean;
  @Column()
  company_code: string;
  @Column()
  url_logo: string;
  @Column()
  bank_name: string;
  @Column()
  bank_account_number: string;
  @Column()
  bank_account_name: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @OneToMany(() => Account, (account) => account.company)
  accounts: Account[];
}
