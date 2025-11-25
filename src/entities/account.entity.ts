import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { AcceptApp } from './accept_app.entity';
import { RefreshToken } from './refresh_token.entity';
import { CommissionAgent } from './commission_agent.entity';

@Entity('tbl_account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', unique: true, nullable: false, length: 255 })
  username: string;
  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;
  @Column({ type: 'varchar', nullable: true, length: 255 })
  email: string;
  @Column({ type: 'varchar', nullable: false, length: 20 })
  phone: string;
  @Column({ type: 'varchar', nullable: false, length: 50 })
  role: string;
  @Column({ type: 'varchar', nullable: false, length: 255 })
  address: string;
  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;
  @Column({ type: 'boolean', nullable: false })
  status: boolean;
  @Column({ type: 'int', nullable: true })
  gender: number;
  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @ManyToOne(() => Company, (company) => company.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToOne(() => AcceptApp, (acceptApp) => acceptApp.account, {
    cascade: true,
    nullable: true,
  })
  accept_app: AcceptApp;

  @OneToOne(
    () => CommissionAgent,
    (commissionAgent) => commissionAgent.account,
    {
      cascade: true,
    },
  )
  commission_agent: CommissionAgent;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.account)
  refresh_tokens: RefreshToken[];
}
