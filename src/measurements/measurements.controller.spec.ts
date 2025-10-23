import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';

type MeasurementsServiceMock = jest.Mocked<
  Pick<MeasurementsService, 'getAllForPatient' | 'setReadWithAccess'>
>;

describe('MeasurementsController', () => {
  let controller: MeasurementsController;
  let service: MeasurementsServiceMock;

  beforeEach(async () => {
    const serviceMock: MeasurementsServiceMock = {
      getAllForPatient: jest.fn(),
      setReadWithAccess: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementsController],
      providers: [
        {
          provide: MeasurementsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<MeasurementsController>(MeasurementsController);
    service = module.get(MeasurementsService);
  });

  describe('GET /measurements', () => {
    it('throws 400 when patientId is missing', () => {
      expect(() => controller.getAll({} as any)).toThrow(BadRequestException);
    });

    it('forwards patientId, page, pageSize to service and returns its result', () => {
      service.getAllForPatient.mockReturnValue({
        data: [{ id: 1 } as any],
        meta: {
          page: 2,
          pageSize: 5,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: true,
        },
      });

      const res = controller.getAll({
        patientId: 'p1',
        page: 2,
        pageSize: 5,
      } as any);

      expect(service.getAllForPatient).toHaveBeenCalledWith('p1', 2, 5);
      expect(res.data).toHaveLength(1);
      expect(res.meta.page).toBe(2);
      expect(res.meta.pageSize).toBe(5);
    });

    it('propagates service errors (e.g., ForbiddenException)', () => {
      service.getAllForPatient.mockImplementation(() => {
        throw new ForbiddenException();
      });

      expect(() =>
        controller.getAll({
          patientId: 'denied',
          page: 1,
          pageSize: 10,
        } as any),
      ).toThrow(ForbiddenException);
    });
  });

  describe('PATCH /measurements/:id/read', () => {
    it('passes allowedIds, id, and read=true to service when provided', () => {
      service.setReadWithAccess.mockReturnValue({ id: 123, read: true } as any);

      const res = controller.setRead(['p1', 'p2'], 123, { read: true } as any);

      expect(service.setReadWithAccess).toHaveBeenCalledWith(
        ['p1', 'p2'],
        123,
        true,
      );
      expect(res.read).toBe(true);
    });

    it('defaults to read=true when body.read is omitted (service receives undefined)', () => {
      service.setReadWithAccess.mockReturnValue({ id: 55, read: true } as any);

      const res = controller.setRead(['p1'], 55, {} as any);

      expect(service.setReadWithAccess).toHaveBeenCalledWith(
        ['p1'],
        55,
        undefined,
      );
      expect(res.read).toBe(true);
    });

    it('propagates NotFoundException from service', () => {
      service.setReadWithAccess.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() =>
        controller.setRead(['p1'], 999999, { read: true } as any),
      ).toThrow(NotFoundException);
    });

    it('propagates ForbiddenException from service', () => {
      service.setReadWithAccess.mockImplementation(() => {
        throw new ForbiddenException();
      });

      expect(() =>
        controller.setRead(['p-allowed'], 777, { read: true } as any),
      ).toThrow(ForbiddenException);
    });
  });
});
