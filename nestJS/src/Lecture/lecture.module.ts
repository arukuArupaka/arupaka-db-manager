// src/lecture/lecture.module.ts
import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LectureService } from './lecture.service';

@Module({
  imports: [PrismaModule],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
