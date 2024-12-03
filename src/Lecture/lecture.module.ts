import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { PrismaServiceProvider } from '../prisma/prisma.provider';

@Module({
  controllers: [LectureController],
  providers: [PrismaServiceProvider],
})
export class LectureModule {}
