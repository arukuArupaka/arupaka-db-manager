/* eslint-disable prettier/prettier */
import { Academics, Campus, Weekday } from '@prisma/client';
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
  academic?: Academics;

  @IsOptional()
  @IsString()
  @IsEnum(Campus)
  campus?: Campus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schoolYear?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  semester?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(Weekday)
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
  name?: string;

  @IsOptional()
  @IsString()
  teacher?: string;
}
