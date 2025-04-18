import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Schedule } from '@prisma/client';
import { CronJob } from 'cron';
import { LineBotService } from './line-bot.service';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { EnvironmentsService } from 'src/config/environments.service';

@Injectable()
export class ScheduleInitializerService implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly lineBotService: LineBotService,
    private readonly prisma: CustomPrismaService,
    private readonly env: EnvironmentsService,
  ) {}

  async onModuleInit() {
    const schedules = await this.prisma.schedule.findMany();
    const groupId = this.env.GroupId;

    // → handler は同期関数で、Schedule を受け取って onTick 関数を返す
    const handler = (input: Schedule): (() => Promise<void>) => {
      switch (input.category) {
        case 'RESULT':
          return async () => {
            await this.lineBotService.sendFormResult({
              groupId,
              id: input.id,
              message: input.message,
              formGroupId: input.formGroupId,
            });
          };
        case 'MESSAGE':
          return async () => {
            await this.lineBotService.sendMessage({
              groupId,
              textEventMessage: input.message,
            });
          };
        case 'FORM':
          return async () => {
            await this.lineBotService.createForm({
              groupId,
              id: input.scheduleId,
              message: input.message,
              formGroupId: input.formGroupId,
            });
          };
        default:
          // 安全策としてダミー関数
          return async () => {};
      }
    };

    schedules.forEach((schedule) => {
      // 秒フィールドを先頭に追加 (cron ライブラリの仕様)
      const minute = schedule.minute ?? '*';
      const hour = schedule.hour ?? '*';
      const weekday =
        schedule.weekday == null
          ? '*'
          : [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].indexOf(schedule.weekday);

      const cronTime = `0 ${minute} ${hour} * * ${weekday}`;
      const onTick = handler(schedule); // <- ここでコールバック関数を生成

      const job = new CronJob(
        cronTime,
        onTick, // Promise<void> を返す async 関数
        null,
        false,
        'Asia/Tokyo',
      );

      this.schedulerRegistry.addCronJob(schedule.scheduleId, job);
      job.start();
    });
  }
}
