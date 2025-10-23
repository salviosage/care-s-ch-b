import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PatientScopeGuard } from './guards/patient-scope.guard';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MeasurementsController],
  providers: [MeasurementsService, JwtAuthGuard, PatientScopeGuard],
})
export class MeasurementsModule {}
