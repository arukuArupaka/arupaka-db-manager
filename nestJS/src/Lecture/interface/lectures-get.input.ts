/* eslint-disable prettier/prettier */
import { Academics, Campus, Semester, Weekday } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class LecturesGetInput {
  @IsOptional()
  @IsString()
  @IsEnum(Academics)
  @Type(() => String)
  academic?: Academics;

  @IsOptional()
  @IsString()
  @IsEnum(Campus)
  @Type(() => String)
  campus?: Campus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schoolYear?: number;

  @IsOptional()
  @IsBoolean()
  @IsEnum(Semester)
  @Type(() => String)
  semester?: Semester;

  @IsOptional()
  @IsString()
  @IsEnum(Weekday)
  @Type(() => String)
  weekday?: Weekday;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  period?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classCode?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  teacher?: string;
}
