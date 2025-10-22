import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { createMock } from '@golevelup/ts-jest';

describe('MeasurementsController', () => {
  let measurementsController: MeasurementsController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementsController],
      providers: [
        {
          provide: MeasurementsService,
          useValue: createMock<MeasurementsService>(),
        },
      ],
    }).compile();

    measurementsController = app.get<MeasurementsController>(
      MeasurementsController,
    );
  });

  describe('GET /measurements', () => {
    it("should throw 403 if the user does not have permission to get a patient's measurements", async () => {});
  });

  describe('PATCH /measurements/:id', () => {
    it('should throw 403 if the user does not have permission to flag a measurement as read', async () => {});
    it('should throw 404 if no measurement exist with that id', async () => {});
  });
});
