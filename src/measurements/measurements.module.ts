import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';

@Module({
  imports: [],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
