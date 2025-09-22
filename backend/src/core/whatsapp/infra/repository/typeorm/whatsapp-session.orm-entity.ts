import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'whatsapp_sessions' })
export class WhatsAppSessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  userId!: string;

  @Column({ type: 'text', nullable: true })
  sessionJson?: string | null;
}


