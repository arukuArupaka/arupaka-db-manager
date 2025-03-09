/* eslint-disable prettier/prettier */
import { LectureCreatePayload } from './lecture-create.payload';

/* eslint-disable prettier/prettier */
export type UpsertLectureInput = {
  classroomIdLectureMap: Map<number, LectureCreatePayload[]>;
  lectureUpsertCache: Map<string, Promise<any>>;
};
