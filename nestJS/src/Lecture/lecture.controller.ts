// src/lecture/lecture.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Campus } from '@prisma/client';

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
      const filePath = path.join(__dirname, `mymodel${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(jsonData);
      const newlectures = data.map((el) => ({
        schoolYear: el.fields.schoolYear,
        classCode: el.fields.classCode,
        name: el.fields.name,
        credits: el.fields.credits,
        syllabus: el.fields.syllabus,
        teacher: el.fields.teacher,
        academic: el.fields.academic,
        classroom: el.fields.classroom,
        semester: Boolean(el.fields.semester),
        weekday: el.fields.weekday,
        period: el.fields.period,
        campus: el.fields.campus,
      }));

      await this.prisma.lecture.createMany({
        data: newlectures,
      });
    }
    return 'OK';
  }
}
