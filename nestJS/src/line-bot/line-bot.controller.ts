/* eslint-disable prettier/prettier */
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { LineBotSignatureGuard } from 'src/common/guards/line-bot-signature/line-bot-signature.guard';

@Controller('line-bot')
export class LineBotController {
  constructor(private readonly botService: LineBotService) {}

  @Get()
  async APITest() {
    return 'test success';
  }

  @Post('send-message')
  @UseGuards(LineBotSignatureGuard)
  async sendMessage(@Body() req: WebhookRequestBody): Promise<string> {
    const events: WebhookEvent[] = req.events;

    this.botService.lineSendMessageProcess(events);

    return 'ok';
  }
}
