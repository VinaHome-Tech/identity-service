import { Account } from 'src/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_company')
export class CompanyOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', nullable: false, length: 255 }) // Tên công ty
  company_name: string;
  @Column({ type: 'varchar', nullable: false, length: 255 }) // Tên công ty tham gia nền tảng
  company_short_name: string;
  @Column({ type: 'varchar', nullable: false, length: 50 }) // Mã số thuế
  tax_code: string;
  @Column({ type: 'varchar', nullable: false, length: 255 }) // Số giấy phép kinh doanh
  business_license_number: string;
  @Column({ type: 'varchar', nullable: false, length: 255 }) // Email công ty
  email: string;
  @Column({ type: 'varchar', nullable: false, length: 20 }) // Số điện thoại công ty
  phone: string;
  @Column({ type: 'varchar', nullable: false, length: 255 }) // Người đại diện pháp luật
  legal_representative: string;
  @Column({ type: 'varchar', nullable: true, length: 255 }) // Địa chỉ trụ sở chính
  head_office_address: string;
  @Column({ type: 'boolean', nullable: false }) // Trạng thái công ty
  status: boolean;
  @Column({ type: 'varchar', nullable: false, length: 255, unique: true }) // Mã công ty
  company_code: string;
  @Column({ type: 'varchar', nullable: true, length: 255 }) // URL logo công ty
  url_logo: string;
  @Column({ type: 'varchar', nullable: true, length: 255 }) // Tên ngân hàng
  bank_name: string;
  @Column({ type: 'varchar', nullable: true, length: 255 }) // Số tài khoản ngân hàng
  bank_account_number: string;
  @Column({ type: 'varchar', nullable: true, length: 255 }) // Tên chủ tài khoản ngân hàng
  bank_account_name: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
  @OneToMany(() => Account, (account) => account.company)
  accounts: Account[];
}
