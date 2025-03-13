/* eslint-disable prettier/prettier */
import { Campus, Semester, Weekday } from '@prisma/client';
import { Academics } from '../../listing-item/interface/listing-item.payload';

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
