import { Injectable } from '@nestjs/common';
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
    const fileContent = fs.readFileSync(filePath, 'utf8');
    this.measurements = JSON.parse(fileContent);
  }
}
