import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { MeasurementsModule } from 'src/measurements/measurements.module';
import { DatabaseService } from 'src/database/database.service';
import type { IMeasurement } from 'src/@types/measurement';

describe('Measurements (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;

  const ALLOWED_1 = '3cb248ba-be82-414f-b961-193db0d26e93';
  const ALLOWED_2 = 'bc7da289-3863-4da4-89fa-3df4feec5c6a';
  const DENIED = '708f9ddc-7c2c-4221-b0c3-3de2f0bcc078';

  const seed: IMeasurement[] = [
    {
      id: 1,
      patientId: ALLOWED_1,
      type: 'Blood pressure',
      values: { systolic: 144, diastolic: 108 },
      date: '2025-09-02T12:04:28Z',
      read: false,
    },
    {
      id: 2,
      patientId: ALLOWED_1,
      type: 'Blood pressure',
      values: { systolic: 139, diastolic: 105 },
      date: '2025-09-03T12:09:14Z',
      read: false,
    },
    {
      id: 4,
      patientId: ALLOWED_1,
      type: 'Blood glucose',
      value: 81.3,
      date: '2025-09-01T12:01:55Z',
      read: false,
    },
    {
      id: 5,
      patientId: ALLOWED_1,
      type: 'Blood glucose',
      value: 83.9,
      date: '2025-09-01T18:06:01Z',
      read: false,
    },
    {
      id: 6,
      patientId: ALLOWED_1,
      type: 'Blood glucose',
      value: 84.1,
      date: '2025-09-01T23:50:19Z',
      read: false,
    },
    {
      id: 7,
      patientId: DENIED,
      type: 'Blood glucose',
      value: 91.7,
      date: '2025-09-02T12:12:12Z',
      read: false,
    },
    {
      id: 8,
      patientId: DENIED,
      type: 'Blood glucose',
      value: 79.5,
      date: '2025-09-02T18:02:44Z',
      read: false,
    },
    {
      id: 9,
      patientId: DENIED,
      type: 'Blood glucose',
      value: 85.1,
      date: '2025-09-02T23:31:22Z',
      read: false,
    },
    {
      id: 10,
      patientId: ALLOWED_2,
      type: 'Blood pressure',
      values: { systolic: 161, diastolic: 117 },
      date: '2025-09-02T14:16:46Z',
      read: false,
    },
    {
      id: 11,
      patientId: ALLOWED_2,
      type: 'Body temperature',
      value: 39.8,
      date: '2025-09-01T15:30:04Z',
      read: false,
    },
    {
      id: 12,
      patientId: ALLOWED_2,
      type: 'Blood glucose',
      value: 97.2,
      date: '2025-09-02T16:38:51Z',
      read: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MeasurementsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    db = app.get(DatabaseService);
    // test-only override of private helper
    (db as any)._reset(JSON.parse(JSON.stringify(seed)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /measurements', () => {
    it('400 when patientId is missing', async () => {
      await request(app.getHttpServer()).get('/measurements').expect(400);
    });

    it("403 when user doesn't have access to that patient", async () => {
      await request(app.getHttpServer())
        .get('/measurements')
        .query({ patientId: DENIED })
        .expect(403);
    });

    it("200 returns patient's measurements with pagination and newest-first ordering", async () => {
      const res = await request(app.getHttpServer())
        .get('/measurements')
        .query({ patientId: ALLOWED_1, page: 1, pageSize: 2 })
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toMatchObject({
        page: 1,
        pageSize: 2,
        total: 5,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });

      const [a, b] = res.body.data;
      expect(new Date(a.date).getTime()).toBeGreaterThanOrEqual(
        new Date(b.date).getTime(),
      );
    });
  });

  describe('PATCH /measurements/:id/read (with PatientScopeGuard on all routes)', () => {
    it("200 marks a patient's measurement as read (include patientId for guard)", async () => {
      const res = await request(app.getHttpServer())
        .patch('/measurements/1/read')
        .query({ patientId: ALLOWED_1 })
        .send({ read: true })
        .expect(200);

      expect(res.body.id).toBe(1);
      expect(res.body.read).toBe(true);
    });

    it('200 defaults to read=true when body is omitted (still include patientId)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/measurements/2/read')
        .query({ patientId: ALLOWED_1 })
        .expect(200);

      expect(res.body.id).toBe(2);
      expect(res.body.read).toBe(true);
    });

    it('403 when patientId in request is not allowed (guard blocks)', async () => {
      await request(app.getHttpServer())
        .patch('/measurements/7/read')
        .query({ patientId: DENIED })
        .send({ read: true })
        .expect(403);
    });

    it('404 when measurement id does not exist (guard passes, service 404s)', async () => {
      await request(app.getHttpServer())
        .patch('/measurements/999999/read')
        .query({ patientId: ALLOWED_1 })
        .send({ read: true })
        .expect(404);
    });
  });
});
