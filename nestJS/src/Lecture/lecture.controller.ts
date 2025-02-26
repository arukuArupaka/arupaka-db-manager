// src/lecture/lecture.controller.ts
import {
  Controller,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import { Campus, Weekday } from '@prisma/client';
import { LectureService } from './lecture.service';
import { UnavailableRoomsPayload } from './interface/unavilable-classrooms.payload';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly prisma: CustomPrismaService,
    private lectureService: LectureService,
  ) {}

  // 実験用のエンドポイント
  @Get('get_lecture')
  async getLecture() {
    return await this.prisma.lecture.findMany();
  }

  @Get('get_unavailable_classrooms')
  /*エンドポイントを叩く際、正しい形式で入力するように注意してください
    以下の引数の型注釈を参考にしてください。(特にCampusやWeekdayなどは)
     */
  async getUnavailableClassRooms(
    @Query('campus') campus: Campus,
    @Query('year') year: number,
    @Query('semester') semester: boolean,
    @Query('weekday') weekDay: Weekday,
    @Query('period') period: number,
  ): Promise<UnavailableRoomsPayload> {
    return this.lectureService.getClassRoom(
      campus,
      year,
      semester,
      weekDay,
      period,
    );
  }
}
