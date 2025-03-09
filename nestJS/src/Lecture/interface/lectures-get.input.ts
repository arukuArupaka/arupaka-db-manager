/* eslint-disable prettier/prettier */
import { Academics, Campus, Weekday } from '@prisma/client';

export class LecturesGetInput {
  academic?: Academics;
  campus?: Campus;
  schoolYear?: number;
  semester?: boolean;
  weekday?: Weekday;
  period?: number;
  classCode?: number;
  name?: string;
  teacher?: string;
}
