/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class OccupiedClassroomsGetPayload {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  building: string;

  @IsString()
  classroom: string;

  @IsOptional()
  @IsString()
  teacher?: string;

  @IsString()
  isUsed: boolean;
}
