/* eslint-disable prettier/prettier */
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { CreateScheduleInput } from './interface/create-schedule.input';

@Controller('line-bot')
export class LineBotController {
  constructor(private readonly botService: LineBotService) {}

  @Get()
  async APITest() {
    return 'test success';
  }

  @Post('send-message')
  async sendMessage(@Body() req: WebhookRequestBody): Promise<string> {
    const events: WebhookEvent[] = req.events;

    this.botService.lineSendMessageProcess(events);

    return 'ok';
  }

  @Post('create-schedule')
  async createSchedule(@Body() req: CreateScheduleInput): Promise<string> {
    return await this.botService.createSchedule(req);
  }

  @Get('get-all-schedule')
  async getAllSchedule() {
    return await this.botService.getAllSchedule();
  }
}
