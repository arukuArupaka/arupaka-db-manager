/* eslint-disable prettier/prettier */
import { Academics, Campus, Semester, Weekday } from '@prisma/client';

export type LectureCreatePayload = {
  schoolYear: number;
  classCode: number;
  name: string;
  credits: number;
  syllabus: string;
  teacher: string;
  academic: Academics;
  semester: Semester;
  weekday: Weekday;
  period: number;
  campus: Campus;
  rawClassroom: string;
};
