import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PatientScopeGuard } from './guards/patient-scope.guard';
import { GetMeasurementsQueryDto } from './dtos/get-measurements.query.dto';
import { PatchReadRequestDto } from './dtos/patch-read.request.dto';
import { AllowedIds } from './decorators/allowed-ids.decorator';

@UseGuards(JwtAuthGuard, PatientScopeGuard)
@Controller('/measurements')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MeasurementsController {
  constructor(private readonly measurements: MeasurementsService) {}

  @Get()
  getAll(@Query() q: GetMeasurementsQueryDto) {
    if (!q.patientId) throw new BadRequestException('patientId is required');
    return this.measurements.getAllForPatient(q.patientId, q.page, q.pageSize);
  }

  @Patch(':id/read')
  setRead(
    @AllowedIds() allowedIds: string[],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchReadRequestDto,
  ) {
    return this.measurements.setReadWithAccess(allowedIds, id, body.read);
  }
}
