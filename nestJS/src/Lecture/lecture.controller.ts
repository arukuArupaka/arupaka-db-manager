// src/lecture/lecture.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly prisma: CustomPrismaService,
    private lectureService: LectureService,
  ) {}

  // 実験用のエンドポイント
  @Get('get_lectures')
  async getLecture() {
    return await this.prisma.lecture.findMany();
  }

  @Get('load-lecture')
  async loadLecture() {
    return this.lectureService.loadLecture();
  }

  @Get('delete-lectures')
  async deleteLecture() {
    return await this.prisma.lecture.deleteMany({});
  }

  @Get('get-all-classrooms')
  async getAllClassRooms() {
    const classrooms = await this.prisma.lecture.findMany({
      select: {
        lectureClassRooms: {
          select: {
            classRoom: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return new Set(
      classrooms.map((el) => el.lectureClassRooms[0].classRoom.name),
    );
  }

  // @Get('get_unavailable_classrooms')
  /*エンドポイントを叩く際、正しい形式で入力するように注意してください
    以下の引数の型注釈を参考にしてください。(特にCampusやWeekdayなどは)
     */
  // async getUnavailableClassRooms(
  //   @Query('campus') campus: Campus,
  //   @Query('year') year: number,
  //   @Query('semester') semester: boolean,
  //   @Query('weekday') weekDay: Weekday,
  //   @Query('period') period: number,
  // ): Promise<UnavailableRoomsPayload> {
  //   return this.lectureService.getClassRoom(
  //     campus,
  //     year,
  //     semester,
  //     weekDay,
  //     period,
  //   );
  // }
}
