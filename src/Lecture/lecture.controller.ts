import { Controller, Get, Inject } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/prisma.service';

@Controller('lecture')
export class LectureController {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService,
  ) {}

  // 実験用のエンドポイント
  @Get('getLecture')
  async getLecture() {
    return await this.prisma.lecture.findMany();
  }
}
