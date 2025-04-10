import { Academics } from "./Academics";
import { Campus } from "./Campus";
import { Semester } from "./Semester";
import { Weekday } from "./Weekday";

export type Lecture = {
  id: number;
  classCode: number;
  name: string;
  credits: number;
  category?: string;
  field?: string;
  syllabus?: string;
  teacher: string;
  academic: Academics;
  schoolYear: number;
  semester: Semester;
  weekday: Weekday;
  period: number;
  feedbacks: string[];
  campus?: Campus;
  rawClassroom?: string;
  lectureClassrooms: string[];
};
