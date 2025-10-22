import { Module } from '@nestjs/common';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [MeasurementsModule],
})
export class AppModule {}
