import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import type { IMeasurement } from 'src/@types/measurement';

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class MeasurementsService {
  constructor(private readonly db: DatabaseService) {}

  getAllForPatient(
    userPatientIds: string[],
    patientId: string,
    page = 1,
    pageSize = 20,
  ): { data: IMeasurement[]; meta: PageMeta } {
    if (!userPatientIds?.includes(patientId)) {
      throw new ForbiddenException('You do not have access to this patient');
    }

    const all = this.db
      .getByPatientId(patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const p = Math.min(Math.max(1, page), totalPages);
    const start = (p - 1) * pageSize;

    return {
      data: all.slice(start, start + pageSize),
      meta: {
        page: p,
        pageSize,
        total,
        totalPages,
        hasNext: p < totalPages,
        hasPrev: p > 1,
      },
    };
  }

  setRead(userPatientIds: string[], id: number, read = true): IMeasurement {
    const m = this.db.getById(id);
    if (!m) throw new NotFoundException('Measurement not found');
    if (!userPatientIds?.includes(m.patientId)) {
      throw new ForbiddenException('You do not have access to this patient');
    }
    return this.db.updateRead(id, read);
  }
}
