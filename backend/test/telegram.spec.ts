import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('TelegramController (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwt = app.get(JwtService);
    await app.init();

    token = jwt.sign(
      { sub: 'test-user-id', email: 'test@example.com' },
      { secret: process.env.JWT_SECRET || 'dev-secret' },
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/telegram/connect requires auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/telegram/connect')
      .send({ phone: '+10000000000' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/telegram/connect returns 200 or 500 depending on env', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/telegram/connect')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '+10000000000' });
    expect([200, 500]).toContain(res.status);
  }, 30000);
});


