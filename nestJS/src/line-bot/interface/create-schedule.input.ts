import { Weekday } from '@prisma/client';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class CreateScheduleInput {
  @IsEnum(Weekday)
  dayOfWeek: number;

  @IsInt()
  hour: number;

  @IsInt()
  minute: number;

  @IsString()
  message: string;

  @IsString()
  description: string;
}
