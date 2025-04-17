/* eslint-disable prettier/prettier */
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { CreateScheduleInput } from './interface/create-schedule.input';
import { DeleteScheduleInput } from './interface/delete-schedule.input';
import { UpdateScheduleInput } from './interface/update-schedule.input';
import { GoogleFormService } from './google-form.service';

@Controller('line-bot')
export class LineBotController {
  constructor(
    private readonly botService: LineBotService,
    private readonly googleFormService: GoogleFormService,
  ) {}

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
    return await this.botService.createSendMessageSchedule(req);
  }

  @Post('create-form')
  async createForm(@Body() req: any): Promise<string> {
    return await this.botService.createForm(req);
  }

  @Post('delete-schedule')
  async deleteSchedule(@Body() req: DeleteScheduleInput): Promise<string> {
    return await this.botService.deleteSchedule(req);
  }

  @Post('update-schedule')
  async updateSchedule(@Body() req: UpdateScheduleInput): Promise<string> {
    return await this.botService.updateSchedule(req);
  }

  @Get('get-all-schedule')
  async getAllSchedule() {
    return await this.botService.getAllSchedule();
  }

  @Get('get-all-schedule-directly')
  async getAllScheduleDirectly() {
    return await this.botService.getScheduleDirectly();
  }

  @Get('get-form-responses')
  async getFormResponses() {
    return await this.googleFormService.aggregateFormResponses();
  }
}
