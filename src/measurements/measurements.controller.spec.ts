import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import type { IMeasurement } from 'src/@types/measurement';

describe('MeasurementsService', () => {
  const seed: IMeasurement[] = [
    {
      id: 1,
      patientId: 'p-allowed',
      type: 'Blood glucose',
      value: 81.3,
      date: '2025-09-01T12:01:55Z',
      read: false,
    },
    {
      id: 2,
      patientId: 'p-allowed',
      type: 'Blood glucose',
      value: 83.9,
      date: '2025-09-01T18:06:01Z',
      read: false,
    },
    {
      id: 3,
      patientId: 'p-allowed',
      type: 'Body temperature',
      value: 38.1,
      date: '2025-09-02T09:00:00Z',
      read: true,
    },
    {
      id: 4,
      patientId: 'p-denied',
      type: 'Blood glucose',
      value: 79.5,
      date: '2025-09-02T18:02:44Z',
      read: false,
    },
  ];

  // minimal fake DB that matches DatabaseService's surface
  const db = {
    getByPatientId: (pid: string) => seed.filter((s) => s.patientId === pid),
    getById: (id: number) => seed.find((s) => s.id === id),
    updateRead: (id: number, read: boolean) => {
      const m = seed.find((s) => s.id === id);
      if (!m) throw new NotFoundException('Measurement not found');
      m.read = read;
      return m;
    },
  } as any;

  const svc = new MeasurementsService(db);

  it('denies access when patient not in user list', () => {
    expect(() =>
      svc.getAllForPatient(['p-allowed'], 'p-denied', 1, 10),
    ).toThrow(ForbiddenException);
  });

  it('paginates and sorts by date desc', () => {
    const { data, meta } = svc.getAllForPatient(
      ['p-allowed'],
      'p-allowed',
      1,
      2,
    );
    // newest first => id 3 (2025-09-02) then id 2 (later on 09-01)
    expect(data.map((d) => d.id)).toEqual([3, 2]);
    expect(meta).toMatchObject({
      page: 1,
      pageSize: 2,
      total: 3,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    });

    const page2 = svc.getAllForPatient(['p-allowed'], 'p-allowed', 2, 2);
    expect(page2.data.map((d) => d.id)).toEqual([1]);
    expect(page2.meta.hasNext).toBe(false);
    expect(page2.meta.hasPrev).toBe(true);
  });

  it('setRead updates read flag when allowed', () => {
    const updated = svc.setRead(['p-allowed'], 1, true);
    expect(updated.read).toBe(true);
  });

  it('setRead is forbidden for other patients', () => {
    expect(() => svc.setRead(['p-allowed'], 4, true)).toThrow(
      ForbiddenException,
    );
  });

  it('setRead throws 404 for unknown id', () => {
    expect(() => svc.setRead(['p-allowed'], 999_999, true)).toThrow(
      NotFoundException,
    );
  });

  it('setRead can also unread (read=false)', () => {
    svc.setRead(['p-allowed'], 3, false);
    const m = db.getById(3);
    expect(m.read).toBe(false);
  });
});
