// src/lecture/lecture.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import { LectureService } from './lecture.service';
import { Academics, Campus, Weekday } from '@prisma/client';
import { LecturePayload } from './interface/lecture.payload';
import { OccupiedClassroomsGetPayload } from './interface/occupied-classrooms-get.payload';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly prisma: CustomPrismaService,
    private lectureService: LectureService,
  ) {}

  @Get('get-lectures')
  async getLecture(
    @Query('classCode') classCode: number,
    @Query('schoolYear') schoolYear: number,
    @Query('semester') semester: boolean,
    @Query('weekday') weekday: Weekday,
    @Query('period') period: number,
    @Query('campus') campus: Campus,
    @Query('academic') academic: Academics,
    @Query('teacher') teacher: string,
    @Query('name') name: string,
  ): Promise<LecturePayload[]> {
    return await this.lectureService.getLectures({
      academic,
      campus,
      schoolYear,
      semester,
      weekday,
      period,
      classCode,
      name,
      teacher,
    });
  }

  @Get('load-lectures')
  async loadLecture() {
    return this.lectureService.loadLectures();
  }

  @Get('get-building-and-classrooms')
  async getBuildingClassrooms(@Query('buildingName') buildingName: string) {
    return this.lectureService.getBuildingAndClassrooms({ buildingName });
  }

  @Get('get-occupied-classrooms')
  /*エンドポイントを叩く際、正しい形式で入力するように注意してください
    以下の引数の型注釈を参考にしてください。(特にCampusやWeekdayなどは)
     */
  async getOccupiedClassrooms(
    @Query('campus') campus: Campus,
    @Query('schoolYear') schoolYear: number,
    @Query('semester') semester: boolean,
    @Query('weekday') weekday: Weekday,
    @Query('period') period: number,
  ): Promise<OccupiedClassroomsGetPayload[]> {
    return this.lectureService.getOccupiedClassrooms({
      campus,
      schoolYear,
      semester,
      weekday,
      period,
    });
  }

  /**
   * 以下のエンドポイントは、全ての講義情報が入っているJSONファイルを読み込み、
   * それらすべての講義の授業コードをもとに、データベースでfindManyを行い、
   * 本来存在するはずのデータがデータベースに存在しない場合、その授業コードを返します。
   */
  @Get('check-all-lectures')
  async checkAllLectures() {
    return this.lectureService.checkAllLectures();
  }

  /**
   * 基本的にはテスト用です。
   * 建物、教室、中間テーブル、講義のデータを全て削除します。
   */
  @Get('delete-lectures')
  async deleteLectures() {
    await this.prisma.lectureClassroom.deleteMany({});
    await this.prisma.classroom.deleteMany({});
    await this.prisma.building.deleteMany({});
    const countLecture = await this.prisma.lecture.deleteMany({});
    return countLecture;
  }
}
