/* eslint-disable prettier/prettier */
export type OccupiedClassroomsGetPayload = {
  name?: string;
  building: string;
  classroom: string;
  teacher?: string;
  isUsed: boolean;
};
