/* eslint-disable prettier/prettier */
import { Campus, Semester, Weekday } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class OccupiedClassroomsGetInput {
  @IsString()
  @IsEnum(Campus)
  campus: Campus;

  @IsInt()
  @Type(() => Number)
  schoolYear: number;

  @IsString()
  @IsEnum(Semester)
  @Type(() => String)
  semester: Semester;

  @IsString()
  @IsEnum(Weekday)
  weekday: Weekday;

  @IsInt()
  @Type(() => Number)
  period: number;
}
