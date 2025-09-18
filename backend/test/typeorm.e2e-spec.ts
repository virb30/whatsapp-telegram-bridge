import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../src/core/user/infra/typeorm/user.orm-entity';
import { BridgeOrmEntity } from '../src/core/bridge/infra/typeorm/bridge.orm-entity';

describe('TypeORM SQLite (e2e)', () => {
  it('should connect and inject repositories', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [UserOrmEntity, BridgeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserOrmEntity, BridgeOrmEntity]),
      ],
    }).compile();

    const userRepo = moduleRef.get<Repository<UserOrmEntity>>(
      getRepositoryToken(UserOrmEntity),
    );
    const bridgeRepo = moduleRef.get<Repository<BridgeOrmEntity>>(
      getRepositoryToken(BridgeOrmEntity),
    );

    const user = await userRepo.save({
      email: 'test@example.com',
      passwordHash: 'x',
    });
    expect(user.id).toBeDefined();

    const bridge = await bridgeRepo.save({
      userId: user.id,
      whatsappGroupId: 'wa-1',
      telegramGroupId: 'tg-1',
    });
    expect(bridge.id).toBeDefined();

    await moduleRef.close();
  });
});
