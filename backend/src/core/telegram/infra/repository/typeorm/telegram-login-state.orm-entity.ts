import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('telegram_login_state')
export class TelegramLoginStateOrmEntity {
  @PrimaryColumn({ type: 'text' })
  userId!: string;

  @Column({ type: 'text' })
  phoneCodeHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


