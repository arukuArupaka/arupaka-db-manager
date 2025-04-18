import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleInput {
  @IsString()
  id: string;

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
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  description: string;
}
