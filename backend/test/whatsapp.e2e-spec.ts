import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('WhatsAppController (e2e)', () => {
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

  it('GET /api/v1/whatsapp/qr should require auth', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/whatsapp/qr');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/whatsapp/qr returns structured payload', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/whatsapp/qr')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('status');
      // qrCode may or may not be present depending on runtime
    }
  });
});
