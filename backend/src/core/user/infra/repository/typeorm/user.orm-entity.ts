import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BridgeOrmEntity } from '../../../../bridge/infra/typeorm/bridge.orm-entity';

@Entity()
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  whatsappSession?: boolean | null;

  @Column({ type: 'text', nullable: true })
  telegramSession?: string | null;

  @OneToMany('BridgeOrmEntity', (bridge: BridgeOrmEntity) => bridge.user)
  bridges!: BridgeOrmEntity[];
}
