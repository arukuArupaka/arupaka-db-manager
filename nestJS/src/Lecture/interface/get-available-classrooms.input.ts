/* eslint-disable prettier/prettier */
import { Campus, Weekday } from '@prisma/client';

export type GetAvailableClassroomsInput = {
  campus: Campus;
  schoolYear: number;
  semester: boolean;
  weekday: Weekday;
  period: number;
};
