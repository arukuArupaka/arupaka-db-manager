/* eslint-disable prettier/prettier */
import { Academics, Campus, Weekday } from '@prisma/client';

export type LectureCreatePayload = {
  schoolYear: number;
  classCode: number;
  name: string;
  credits: number;
  syllabus: string;
  teacher: string;
  academic: Academics;
  semester: boolean;
  weekday: Weekday;
  period: number;
  campus: Campus;
  rawClassroom: string;
};
