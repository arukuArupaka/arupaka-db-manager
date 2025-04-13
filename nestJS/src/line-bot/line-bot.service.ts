/* eslint-disable prettier/prettier */
import { TextEventMessage, WebhookEvent } from '@line/bot-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/environments.service';
import { ReceivedMessageValidatePayload } from './interface/received-message-validate.payload';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { v4 as uuidv4 } from 'uuid';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleInput } from './interface/create-schedule.input';
import { Schedule, Weekday } from '@prisma/client';

@Injectable()
export class LineBotService {
  constructor(
    private readonly env: EnvironmentsService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly prisma: CustomPrismaService,
  ) {}

  /**
   * 曜日の数値を変換する
   */
  convertDayOfWeek(dayOfWeek: number): Weekday {
    switch (dayOfWeek) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        throw new BadRequestException('Invalid dayOfWeek value');
    }
  }

  /**
   * 指定IDのジョブを作成する。
   * @param dayOfWeek 曜日（0:日曜〜6:土曜）
   * @param hour 時（0-23）
   * @param minute 分（0-59）
   * @param message メッセージ内容
   * @param description スケジュールの説明
   */
  async createSchedule(input: CreateScheduleInput): Promise<string> {
    const id = uuidv4();
    if (this.schedulerRegistry.doesExist('cron', id)) {
      throw new BadRequestException(
        `ID: ${id} のスケジュールは既に存在します。`,
      );
    }

    const groupId = this.env.GroupId;

    await this.prisma.schedule.create({
      data: {
        scheduleId: id,
        weekday: this.convertDayOfWeek(input.weekday),
        hour: input.hour,
        minute: input.minute,
        message: input.message,
        description: input.description,
      },
    });

    // cron式： "分 時 * * 曜日"
    const cronTime = `${input.minute} ${input.hour} * * ${input.weekday}`;

    const job = new CronJob(cronTime, async () => {
      await this.sendMessage({ groupId, textEventMessage: input.message });
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();

    return `スケジュール[${id}]を作成しました。`;
  }

  async issueGroupLink(replyToken: string, textEventMessage: TextEventMessage) {
    const client = this.env.createLinebotClient();

    client.replyMessage({
      replyToken: replyToken,
      messages: [{ type: 'text', text: textEventMessage.text }],
    });
  }

  /**
   * LINEから受信したメッセージを検証する
   * @param events
   * @returns
   */
  private async validateReceivedMessage(
    events: WebhookEvent[],
  ): Promise<ReceivedMessageValidatePayload[] | void> {
    if (events.length === 0) {
      throw new BadRequestException('No events');
    }

    const event = events[0];
    const sourceType = event.source.type;

    if (event.type !== 'message' || event.message.type !== 'text') {
      throw new BadRequestException('No text message');
    }

    if (sourceType === 'room') {
      throw new BadRequestException('Room is not supported');
    }

    // ユーザーからのメッセージが来た場合は定型文を返す
    if (sourceType === 'user') {
      return [
        {
          groupId: event.source.userId,
          textEventMessage:
            'グループ以外では利用できません。\n利用開始するにはあなたが所属しているサークルのグループに招待してください。',
        },
      ];
    }

    const groupId = event.source.groupId;

    const messageContent = event.message.text;

    // 「 @~~ 」の部分を取得
    const splitedMessageContent = messageContent.split(',');

    const messageFunction = splitedMessageContent[0];

    if (messageFunction === '@グループID発行') {
      return [
        {
          groupId: groupId,
          textEventMessage: `${groupId}`,
        },
      ];
    }
  }

  /**
   * LINEメッセージを送信する
   * @param message
   * @returns
   */
  private async sendMessage(
    message?: ReceivedMessageValidatePayload,
  ): Promise<void> {
    const client = this.env.createLinebotClient();

    if (!message) {
      return;
    }

    client.pushMessage({
      to: message.groupId,
      messages: [{ type: 'text', text: message.textEventMessage }],
    });
    return;
  }

  /**
   * ユーザーからのメッセージを受信し、条件に合ったLINEメッセージを送信する
   * @param events
   * @returns
   */
  async lineSendMessageProcess(events: WebhookEvent[]): Promise<void> {
    const receivedMessage = await this.validateReceivedMessage(events);

    if (!receivedMessage) {
      return;
    }

    const sendMessagePromises = receivedMessage.map((message) =>
      this.sendMessage(message),
    );

    await Promise.all(sendMessagePromises);
  }

  /**
   * スケジュールを全て取得する
   * @returns
   */
  async getAllSchedule(): Promise<Schedule[]> {
    return await this.prisma.schedule.findMany();
  }
}
