import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('tbl_refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  account_id: string;
  @Column()
  refresh_token: string;
  @Column()
  expires_at: Date;
  @ManyToOne(() => Account, (account) => account.refresh_tokens)
  @JoinColumn({ name: 'account_id' }) // Khóa ngoại
  account: Account;
}
