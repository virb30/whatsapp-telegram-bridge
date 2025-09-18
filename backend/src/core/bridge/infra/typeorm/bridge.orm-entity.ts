import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../user/infra/typeorm/user.orm-entity';

@Entity()
export class BridgeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  whatsappGroupId!: string;

  @Column()
  telegramGroupId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('UserOrmEntity', (user: UserOrmEntity) => user.bridges)
  user!: UserOrmEntity;
}
