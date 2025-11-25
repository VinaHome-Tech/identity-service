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
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  role: string;
  @Column()
  address: string;
  @Column()
  date_of_birth: Date;
  @Column()
  status: boolean;
  @Column()
  gender: string;
  @Column()
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
