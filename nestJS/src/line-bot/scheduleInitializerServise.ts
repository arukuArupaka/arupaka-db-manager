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
    schedules.forEach((schedule) => {
      const minute =
        schedule.minute === undefined || schedule.minute === null
          ? '*'
          : schedule.minute;
      const cronTime = `${minute} ${schedule.hour ?? '*'} * * ${schedule.weekday ?? '*'}`;
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
