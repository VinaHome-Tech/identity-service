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
  @Column()
  bms: boolean;
  @Column()
  cms: boolean;
  @Column()
  ams: boolean;
  @Column()
  driver: boolean;
  @Column({ nullable: true }) // tạm thời cho nullable
  account_id: string;

  @OneToOne(() => Account, (account) => account.accept_app)
  @JoinColumn({ name: 'account_id' }) // chỉ định rõ cột khóa ngoại
  account: Account;
}
