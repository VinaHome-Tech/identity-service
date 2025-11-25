import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('tbl_commission_agent')
export class CommissionAgent {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  ticket_type: string;
  @Column()
  ticket_value: number;
  @Column()
  goods_type: string;
  @Column()
  goods_value: number;
  @OneToOne(() => Account, (account) => account.commission_agent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' }) // 👈 cột này chính là FK sang tbl_account
  account: Account;
}
