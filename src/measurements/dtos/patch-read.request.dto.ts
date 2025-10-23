import { IsBoolean, IsOptional } from 'class-validator';

export class PatchReadRequestDto {
  @IsBoolean()
  @IsOptional()
  read?: boolean = true;
}
