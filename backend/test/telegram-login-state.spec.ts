import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { UserOrmEntity } from '../src/core/user/infra/repository/typeorm/user.orm-entity';
import { BridgeOrmEntity } from '../src/core/bridge/infra/typeorm/bridge.orm-entity';
import { WhatsAppSessionOrmEntity } from '../src/core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import { TelegramLoginStateOrmEntity } from '../src/core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GramJsTelegramService } from '../src/core/telegram/infra/gramjs/telegram.service';
import {
  TELEGRAM_SERVICE,
  TelegramServiceInterface,
} from '../src/core/telegram/application/interfaces/telegram.service';

describe('Telegram login state persistence (unit-ish)', () => {
  let app: INestApplication;
  let repo: Repository<TelegramLoginStateOrmEntity>;
  let service: TelegramServiceInterface;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [
            UserOrmEntity,
            BridgeOrmEntity,
            WhatsAppSessionOrmEntity,
            TelegramLoginStateOrmEntity,
          ],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = app.get<Repository<TelegramLoginStateOrmEntity>>(
      getRepositoryToken(TelegramLoginStateOrmEntity),
    );
    service = app.get<TelegramServiceInterface>(TELEGRAM_SERVICE);
  });

  afterAll(async () => {
    await app.close();
  });

  it('persiste phoneCodeHash no connect e remove no signin (mockando gram.js)', async () => {
    // Arrange: mock do cliente interno
    const svc = service as GramJsTelegramService;
    const client = {
      apiId: 1,
      apiHash: 'hash',
      connected: true,
      session: { save: () => 'SESSION' },
      connect: jest.fn(async () => {}),
      sendCode: jest.fn(async () => ({ phoneCodeHash: 'PCHASH' })),
      signIn: jest.fn(async () => {}),
      sendMessage: jest.fn(async () => {}),
    } as unknown as any;

    // Monkey-patch getClient para evitar importar gram.js
    (svc as unknown as { [k: string]: unknown })['getClient'] = async () => client;

    const userId = 'user-1';

    // Act: connect salva estado
    await service.connect({ userId, phone: '+55999999999' });

    // Assert: registro salvo
    const saved = await repo.findOne({ where: { userId } });
    expect(saved).toBeTruthy();
    expect(saved!.phoneCodeHash).toBe('PCHASH');

    // Act: signin consome e apaga o estado
    await service.signIn({ userId, phone: '+55999999999', code: '12345' });

    // Assert: registro removido
    const after = await repo.findOne({ where: { userId } });
    expect(after).toBeNull();
  });
});


