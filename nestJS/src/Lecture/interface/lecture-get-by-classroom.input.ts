/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class LectureGetByClassroomInput {
  @IsInt()
  @Type(() => Number)
  classroomId: string;
}
