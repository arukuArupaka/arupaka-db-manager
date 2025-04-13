/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LineBotController } from './line-bot.controller';
import { LineBotService } from './line-bot.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnvironmentsService } from 'src/config/environments.service';

@Module({
  imports: [PrismaModule],
  providers: [LineBotService, EnvironmentsService],
  controllers: [LineBotController],
})
export class LineBotModule {}
