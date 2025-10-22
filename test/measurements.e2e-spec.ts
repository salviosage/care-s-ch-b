import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MeasurementsModule } from 'src/measurements/measurements.module';

describe('MeasurementsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MeasurementsModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  describe('GET /measurements', () => {
    it("Should return the patient's measurements", async () => {
      const result = await request(app.getHttpServer()).get('/').query({});
    });
  });

  describe('PATCH /measurements/:id', () => {
    it("Should flag a patient's measurement as read", async () => {
      const result = await request(app.getHttpServer())
        .patch(`/:your_id`)
        .send({});
    });
  });
});
