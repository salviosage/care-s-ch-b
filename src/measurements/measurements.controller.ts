import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import type { IMeasurement } from 'src/@types/measurement';
import { GetMeasurementsQueryDto } from './dtos/get-measurements.query.dto';
import { PatchReadRequestDto } from './dtos/patch-read.request.dto';
import { User } from './decorators/user.decorator';

@Controller('/measurements')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MeasurementsController {
  constructor(private readonly measurements: MeasurementsService) {}

  // GET all measurements for a patient, paginated
  @Get()
  getAll(
    @User() userPatientIds: string[],
    @Query() query: GetMeasurementsQueryDto,
  ) {
    if (!query.patientId) {
      throw new BadRequestException('patientId is required');
    }
    return this.measurements.getAllForPatient(
      userPatientIds,
      query.patientId,
      query.page,
      query.pageSize,
    );
  }

  // Update the `read` flag of a measurement
  @Patch(':id/read')
  setRead(
    @User() userPatientIds: string[],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchReadRequestDto,
  ): IMeasurement {
    return this.measurements.setRead(userPatientIds, id, body.read);
  }
}
