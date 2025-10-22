import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import type { IMeasurement } from 'src/@types/measurement';
import { GetAllMeasurementsRequestDto } from './dtos/get-all-measurements.request.dto';
import { User } from './decorators/user.decorator';

@Controller('/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get('/')
  getAllMeasurements(
    @User() user: string[],
    @Query() query: GetAllMeasurementsRequestDto,
  ): IMeasurement[] {
    throw new NotImplementedException();
  }

  @Patch('/:id')
  tagMeasurement(
    @User() user: string[],
    @Param('id') id: number,
  ): IMeasurement {
    throw new NotImplementedException();
  }
}
