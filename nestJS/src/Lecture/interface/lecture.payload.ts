/* eslint-disable prettier/prettier */
import { Academics, Weekday } from '@prisma/client';

export class LecturePayload {
  id: number;
  classCode: number;
  name: string;
  credits: number;
  category?: string;
  field?: string;
  syllabus?: string;
  teacher: string;
  academic: Academics;
  schoolYear: number;
  semester: boolean;
  weekday: Weekday;
  period: number;
  rawClassroom?: string;
}
