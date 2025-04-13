import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { CronJob } from 'cron';
import { Schedule } from '@prisma/client';
import { LineBotService } from './line-bot.service';
import { EnvironmentsService } from 'src/config/environments.service';

@Injectable()
export class ScheduleInitializerService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleInitializerService.name);

  constructor(
    private readonly prisma: CustomPrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly lineBotService: LineBotService,
    private readonly env: EnvironmentsService,
  ) {}

  async onModuleInit() {
    const schedules: Schedule[] = await this.prisma.schedule.findMany();
    const groupId = this.env.GroupId;
    const convertWeekday = (weekday: string): number => {
      switch (weekday) {
        case 'Sunday':
          return 0;
        case 'Monday':
          return 1;
        case 'Tuesday':
          return 2;
        case 'Wednesday':
          return 3;
        case 'Thursday':
          return 4;
        case 'Friday':
          return 5;
        case 'Saturday':
          return 6;
      }
    };
    schedules.forEach((schedule) => {
      const minute =
        schedule.minute === undefined || schedule.minute === null
          ? '*'
          : schedule.minute;

      const weekday =
        schedule.weekday === undefined || schedule.weekday === null
          ? '*'
          : convertWeekday(schedule.weekday);
      const cronTime = `${minute} ${schedule.hour ?? '*'} * * ${weekday}`;
      const job = new CronJob(cronTime, async () => {
        await this.lineBotService.sendMessage({
          groupId,
          textEventMessage: schedule.message,
        });
      });
      this.schedulerRegistry.addCronJob(schedule.scheduleId, job);
      job.start();
    });
  }
}
