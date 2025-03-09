// src/lecture/lecture.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import { LectureService } from './lecture.service';
import { LecturePayload } from './interface/lecture.payload';
import { OccupiedClassroomsGetPayload } from './interface/occupied-classrooms-get.payload';
import { LecturesGetInput } from './interface/lectures-get.input';
import { OccupiedClassroomsGetInput } from './interface/occupied-classrooms-get.input';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly prisma: CustomPrismaService,
    private lectureService: LectureService,
  ) {}

  @Get('get-lectures')
  async getLecture(
    @Query() query: LecturesGetInput,
  ): Promise<LecturePayload[]> {
    return await this.lectureService.getLectures(query);
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
    @Query() query: OccupiedClassroomsGetInput,
  ): Promise<OccupiedClassroomsGetPayload[]> {
    return this.lectureService.getOccupiedClassrooms(query);
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
  async deleteLectures(): Promise<number> {
    return this.lectureService.deleteLectures();
  }
}
