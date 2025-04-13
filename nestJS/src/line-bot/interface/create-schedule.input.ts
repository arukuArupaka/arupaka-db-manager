import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateScheduleInput {
  @IsInt()
  @IsOptional()
  weekday: number;

  @IsInt()
  @IsOptional()
  hour: number;

  @IsInt()
  @IsOptional()
  minute: number;

  @IsString()
  message: string;

  @IsString()
  description: string;
}
