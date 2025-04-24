/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Academics, Campus, Semester, Weekday } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class LecturesGetInput {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(Academics)
  @Type(() => String)
  academic?: Academics;

  @ApiProperty({ required: false, enum: Campus, example: Campus.BKC })
  @IsOptional()
  @IsString()
  @IsEnum(Campus)
  @Type(() => String)
  campus?: Campus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schoolYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(Semester)
  @Type(() => String)
  semester?: Semester;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(Weekday)
  @Type(() => String)
  weekday?: Weekday;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  period?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classCode?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  teacher?: string;
}
