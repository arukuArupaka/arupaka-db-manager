/* eslint-disable prettier/prettier */
import { Campus, Weekday } from '@prisma/client';
import { Academics } from '../../listing-item/interface/listing-item.payload';

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
