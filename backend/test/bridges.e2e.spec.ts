import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { UserOrmEntity } from '../src/core/user/infra/repository/typeorm/user.orm-entity';
import { BridgeOrmEntity } from '../src/core/bridge/infra/typeorm/bridge.orm-entity';
import { WhatsAppSessionOrmEntity } from '../src/core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import { TelegramLoginStateOrmEntity } from '../src/core/telegram/infra/repository/typeorm/telegram-login-state.orm-entity';
import { HASH_SERVICE, HashServiceInterface } from '../src/core/user/application/interfaces/hash.service';

describe('Bridges (e2e)', () => {
  let app: INestApplication;

  let mockHashService: jest.Mocked<HashServiceInterface>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHashService = {
      hash: jest.fn(async (p: string) => `hashed:${p}`),
      verify: jest.fn(async (p: string, h: string) => h === `hashed:${p}`),
    };
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HASH_SERVICE,
          useValue: mockHashService,
        },
      ],
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
  });

  afterAll(async () => {
    await app.close();
  });

  function authAgent() {
    return {
      register: async (email: string) => {
        await request(app.getHttpServer())
          .post('/api/v1/users')
          .send({ email, password: 'P@ssw0rd' })
          .expect(201);
      },
      login: async (email: string) => {
        const res = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email, password: 'P@ssw0rd' })
          .expect(201);
        return (res.body as { access_token: string }).access_token;
      },
    };
  }

  it('should require auth for bridges endpoints', async () => {
    await request(app.getHttpServer()).get('/api/v1/bridges').expect(401);
    await request(app.getHttpServer())
      .post('/api/v1/bridges')
      .send({ whatsappGroupId: 'wa', telegramGroupId: 'tg' })
      .expect(401);
  });

  it('should create, list and delete bridges for the authenticated user only', async () => {
    const agent = authAgent();
    await agent.register('u1@example.com');
    await agent.register('u2@example.com');

    const token1 = await agent.login('u1@example.com');
    const token2 = await agent.login('u2@example.com');

    // user1 creates two bridges
    const res1 = await request(app.getHttpServer())
      .post('/api/v1/bridges')
      .set('Authorization', `Bearer ${token1}`)
      .send({ whatsappGroupId: 'wa-1', telegramGroupId: 'tg-1' })
      .expect(201);
    expect((res1.body as { id: string }).id).toEqual(expect.any(String));

    const res2 = await request(app.getHttpServer())
      .post('/api/v1/bridges')
      .set('Authorization', `Bearer ${token1}`)
      .send({ whatsappGroupId: 'wa-2', telegramGroupId: 'tg-2' })
      .expect(201);

    const b1 = res1.body as { id: string };
    const b2 = res2.body as { id: string };

    // user2 creates one bridge
    await request(app.getHttpServer())
      .post('/api/v1/bridges')
      .set('Authorization', `Bearer ${token2}`)
      .send({ whatsappGroupId: 'wa-3', telegramGroupId: 'tg-3' })
      .expect(201);

    // list for user1 only returns their bridges
    const list1 = await request(app.getHttpServer())
      .get('/api/v1/bridges')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
    const items1 = (list1.body as {
      items: Array<{
        id: string;
        whatsappGroupId: string;
        telegramGroupId: string;
      }>;
    }).items;
    expect(items1).toHaveLength(2);
    expect(items1.map((i) => i.id).sort()).toEqual([b1.id, b2.id].sort());

    // user1 cannot delete user2 bridge
    const list2 = await request(app.getHttpServer())
      .get('/api/v1/bridges')
      .set('Authorization', `Bearer ${token2}`)
      .expect(200);
    const user2BridgeId = (
      list2.body as { items: Array<{ id: string }> }
    ).items[0].id;

    await request(app.getHttpServer())
      .delete(`/api/v1/bridges/${user2BridgeId}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(403);

    // user1 can delete own bridge
    await request(app.getHttpServer())
      .delete(`/api/v1/bridges/${b1.id}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(204);

    const list1After = await request(app.getHttpServer())
      .get('/api/v1/bridges')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
    expect(((list1After.body as { items: any[] }).items)).toHaveLength(1);
  });
});



