/* eslint-disable prettier/prettier */
export type GetAvailableClassroomsPayload = {
  name?: string;
  building: string;
  classroom: string;
  teacher?: string;
  isUsed: boolean;
};
