// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { CustomPrismaService } from './prisma.service';

@Module({
  providers: [CustomPrismaService],
  exports: [CustomPrismaService],
})
export class PrismaModule {}
