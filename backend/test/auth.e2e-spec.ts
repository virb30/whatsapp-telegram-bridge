import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserOrmEntity } from '../src/core/user/infra/repository/typeorm/user.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridgeOrmEntity } from 'src/core/bridge/infra/typeorm/bridge.orm-entity';
import { WhatsAppSessionOrmEntity } from 'src/core/whatsapp/infra/repository/typeorm/whatsapp-session.orm-entity';
import {
  HASH_SERVICE,
  HashServiceInterface,
} from '../src/core/user/application/interfaces/hash.service';
import { CreateUserInputDto } from '../src/modules/user/dto/create-user.dto';
import * as http from 'http';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let httpServer: http.Server;
  let mockHashService: jest.Mocked<HashServiceInterface>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHashService = {
      hash: jest.fn(),
      verify: jest.fn(),
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
          entities: [UserOrmEntity, BridgeOrmEntity, WhatsAppSessionOrmEntity],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as http.Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const agent = request(httpServer);
    const res = await agent
      .post('/api/v1/users')
      .send({
        email: 'auth-e2e@example.com',
        password: 'StrongP@ssw0rd',
      } as CreateUserInputDto)
      .expect(201);

    const body = res.body as { id: string; email: string };

    expect(body.id).toEqual(expect.any(String));
    expect(body.email).toEqual('auth-e2e@example.com');
  });

  it('should login and receive a JWT token', async () => {
    await request(httpServer)
      .post('/api/v1/users')
      .send({ email: 'login-e2e@example.com', password: 'StrongP@ssw0rd' });

    const res = await request(httpServer)
      .post('/api/v1/auth/login')
      .send({ email: 'login-e2e@example.com', password: 'StrongP@ssw0rd' })
      .expect(201);

    const loginBody = res.body as { access_token: string };

    expect(loginBody.access_token).toEqual(expect.any(String));
  });

  it('should reject protected route without token (401) and allow with token (200)', async () => {
    await request(httpServer).get('/api/v1/protected').expect(401);

    await request(httpServer)
      .post('/api/v1/users')
      .send({ email: 'guard-e2e@example.com', password: 'StrongP@ssw0rd' });
    const res = await request(httpServer)
      .post('/api/v1/auth/login')
      .send({ email: 'guard-e2e@example.com', password: 'StrongP@ssw0rd' })
      .expect(201);

    const token = (res.body as { access_token: string }).access_token;

    await request(httpServer)
      .get('/api/v1/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('OK');
  });
});
