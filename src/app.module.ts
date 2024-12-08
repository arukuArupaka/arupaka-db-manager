import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaServiceProvider } from './prisma/prisma.provider';
import { LectureModule } from './Lecture/lecture.module';

@Module({
  imports: [LectureModule],
  providers: [AppService, PrismaServiceProvider],
  exports: [PrismaServiceProvider],
})
export class AppModule {}
