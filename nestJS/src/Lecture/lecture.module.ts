// src/lecture/lecture.module.ts
import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LectureController],
})
export class LectureModule {}
