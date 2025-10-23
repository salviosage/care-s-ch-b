import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMeasurementsQueryDto {
  @IsUUID()
  patientId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number = 20;
}
