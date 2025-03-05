// src/lecture/lecture.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('lecture')
export class LectureController {
  constructor(private readonly prisma: CustomPrismaService) {}

  // 実験用のエンドポイント
  @Get('getLecture')
  async getLecture() {
    return await this.prisma.lecture.findMany();
  }

  @Get('loadLecture')
  async loadLecture() {
    for (let i = 1; i < 4; i++) {
      const filePath = path.join(__dirname, `mymodell${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(jsonData);
      const newlectures = data.map((el) => ({
        schoolYear: el.fields.schoolYear,
        classCode: el.fields.class_code,
        name: el.fields.name,
        credits: el.fields.credits,
        syllabus: el.fields.syllabus,
        teacher: el.fields.teacher,
        academic: el.fields.academic,
        classroom: el.fields.classroom,
        semester: el.fields.semester,
        weekday: el.fields.weekday,
        period: el.fields.period,
      }));

      await this.prisma.lecture.createMany({
        data: newlectures,
      });
    }
    return 'OK';
  }
}
