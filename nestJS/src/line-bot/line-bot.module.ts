/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LineBotController } from './line-bot.controller';
import { LineBotService } from './line-bot.service';

@Module({
  imports: [],
  providers: [LineBotService],
  controllers: [LineBotController],
})
export class LineBotModule {}
