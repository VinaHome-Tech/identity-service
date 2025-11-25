import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('tbl_accept_app')
export class AcceptApp {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'boolean', nullable: false })
  bms: boolean;
  @Column({ type: 'boolean', nullable: false })
  cms: boolean;
  @Column({ type: 'boolean', nullable: false })
  ams: boolean;
  @Column({ type: 'boolean', nullable: false })
  driver: boolean;
  @Column({ nullable: true }) // tạm thời cho nullable
  account_id: string;

  @OneToOne(() => Account, (account) => account.accept_app)
  @JoinColumn({ name: 'account_id' }) // chỉ định rõ cột khóa ngoại
  account: Account;
}
