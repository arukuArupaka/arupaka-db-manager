/* eslint-disable prettier/prettier */
import { Campus, Weekday } from '@prisma/client';

export type OccupiedClassroomsGetInput = {
  campus: Campus;
  schoolYear: number;
  semester: boolean;
  weekday: Weekday;
  period: number;
};
