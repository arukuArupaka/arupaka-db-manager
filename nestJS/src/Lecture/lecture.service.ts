import { Injectable } from '@nestjs/common';
import { Campus, Weekday } from '@prisma/client';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { UnavailableRoomsPayload } from './interface/unavilable-classrooms.payload';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: CustomPrismaService) {}

  async getClassRoom(
    campus: Campus,
    year: number,
    semester: boolean,
    day: Weekday,
    period: number,
  ): Promise<UnavailableRoomsPayload> {
    const lectures = await this.prisma.lecture.findMany({
      where: {
        schoolYear: year,
        semester: semester,
        weekday: day,
        period: period,
        campus: campus,
      },
    });

    const unavailableRooms = {
      classRooms: lectures.map((lecture) => {
        return lecture.classroom;
      }),
    };

    return unavailableRooms;
  }
}
