import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import type { IMeasurement } from 'src/@types/measurement';

@Injectable()
export class MeasurementsService {
  constructor(private readonly db: DatabaseService) {}

  getAllForPatient(patientId: string, page = 1, pageSize = 20) {
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

  setReadWithAccess(
    allowedIds: string[],
    id: number,
    read = true,
  ): IMeasurement {
    const m = this.db.getById(id);
    if (!m) throw new NotFoundException('Measurement not found');
    if (!allowedIds.includes(m.patientId))
      throw new ForbiddenException('Forbidden');
    return this.db.updateRead(id, read);
  }
}
