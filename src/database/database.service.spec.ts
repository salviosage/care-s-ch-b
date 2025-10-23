import { Test } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { IMeasurement } from 'src/@types/measurement';

const seed: IMeasurement[] = [
  {
    id: 1,
    patientId: 'p1',
    type: 'Blood pressure',
    values: { systolic: 120, diastolic: 80 },
    date: '2025-09-01T00:00:00Z',
  },
  {
    id: 2,
    patientId: 'p2',
    type: 'Blood glucose',
    value: 90.1,
    date: '2025-09-02T00:00:00Z',
  },
];

describe('DatabaseService', () => {
  let db: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    db = moduleRef.get(DatabaseService);
    db._reset(JSON.parse(JSON.stringify(seed)));
  });

  it('loads and normalizes read=false by default', () => {
    const all = db.getAll();
    expect(all).toHaveLength(2);
    expect(all[0].read).toBe(false);
    expect(all[1].read).toBe(false);
  });

  it('getByPatientId returns only matching measurements', () => {
    const p1 = db.getByPatientId('p1');
    expect(p1).toHaveLength(1);
    expect(p1[0].id).toBe(1);
  });

  it('getById and updateRead work', () => {
    const m = db.getById(2);
    expect(m).toBeDefined();
    const updated = db.updateRead(2, true);
    expect(updated.read).toBe(true);
    const again = db.getById(2);
    expect(again?.read).toBe(true);
  });
});
