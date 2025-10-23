import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IMeasurement } from 'src/@types/measurement';

@Injectable()
export class DatabaseService {
  private measurements: IMeasurement[];

  constructor() {
    const filePath = path.join(
      __dirname,
      '../../src/database/measurements-data.json',
    );
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed: IMeasurement[] = JSON.parse(raw);

    // normalize: add read=false if missing
    this.measurements = parsed.map((m) => ({
      ...m,
      read: typeof m.read === 'boolean' ? m.read : false,
    }));
  }

  // Return all measurements (for debugging/tests)
  getAll(): IMeasurement[] {
    return [...this.measurements];
  }

  // Return all measurements belonging to a specific patient
  getByPatientId(patientId: string): IMeasurement[] {
    return this.measurements.filter((m) => m.patientId === patientId);
  }

  // Return one measurement by id
  getById(id: number): IMeasurement | undefined {
    return this.measurements.find((m) => m.id === id);
  }

  // Update the `read` flag of a given measurement
  updateRead(id: number, read: boolean): IMeasurement {
    const m = this.getById(id);
    if (!m) throw new NotFoundException('Measurement not found');
    m.read = read;
    return m;
  }

  // Test helper to reset data (to be used in unit tests only)
  _reset(data: IMeasurement[]) {
    this.measurements = data.map((m) => ({
      ...m,
      read: typeof m.read === 'boolean' ? m.read : false,
    }));
  }
}
