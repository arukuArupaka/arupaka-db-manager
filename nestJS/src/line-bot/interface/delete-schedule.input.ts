import { IsString } from 'class-validator';

export class DeleteScheduleInput {
  @IsString()
  id: string;
}
