/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Campus, Semester, Weekday } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class OccupiedClassroomsGetInput {
  @ApiProperty()
  @IsString()
  @IsEnum(Campus)
  campus: Campus;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  schoolYear: number;

  @ApiProperty()
  @IsString()
  @IsEnum(Semester)
  @Type(() => String)
  semester: Semester;

  @ApiProperty()
  @IsString()
  @IsEnum(Weekday)
  weekday: Weekday;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  period: number;
}
