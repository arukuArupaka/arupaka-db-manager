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
import { DeleteScheduleInput } from './interface/delete-schedule.input';
import { UpdateScheduleInput } from './interface/update-schedule.input';
import { ReceivedCreateRequestInput } from './interface/receive-create-request.input';
import { GoogleFormService } from './google-form.service';
import { SendFormResultInput } from './interface/send-form-result.input';
import { CreateFormInput } from './interface/create-form.input';

@Injectable()
export class LineBotService {
  constructor(
    private readonly env: EnvironmentsService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly prisma: CustomPrismaService,
    private readonly googleFormService: GoogleFormService,
  ) {}

  /**
   * 曜日の数値を変換する
   */
  convertDayOfWeek(dayOfWeek: number): Weekday {
    switch (Number(dayOfWeek)) {
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
   * @param weekday 曜日（0:日曜〜6:土曜）
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

    await this.prisma.schedule.create({
      data: {
        scheduleId: id,
        weekday:
          input.weekday === undefined || input.weekday === null
            ? null
            : this.convertDayOfWeek(input.weekday),
        hour: input.hour,
        minute: input.minute,
        message: input.message,
        description: input.description,
        category: input.category,
        formGroupId: input.formGroupId,
      },
    });

    const minute = input.minute ?? '*';
    const hour = input.hour ?? '*';
    const weekday = input.weekday ?? '*';

    const cronTime = `0 ${minute} ${hour} * * ${weekday}`;

    const job = new CronJob(
      cronTime,
      async () => await input.handler({ ...input, id }),
      null,
      false,
      'Asia/Tokyo',
    );

    this.schedulerRegistry.addCronJob(id, job);
    job.start();

    return 'ok';
  }

  async createForm(input: CreateFormInput) {
    console.log('createForm');
    const formInfo = await this.googleFormService.createSampleForm();
    const message = `${input.message}\n${formInfo.publicUrl}`;
    const formId = formInfo.editId;
    console.log(formId);
    await this.prisma.schedule.updateMany({
      where: { formGroupId: input.formGroupId },
      data: { formId: formId },
    });
    return await this.sendMessage({
      groupId: input.groupId,
      textEventMessage: message,
    });
  }

  /**
   * フォームの回答結果を取得して、LINEメッセージを送信する
   * @param input
   */
  async sendFormResult(input: SendFormResultInput) {
    const formResultInfo = await this.prisma.schedule.findMany({
      where: { formGroupId: input.formGroupId },
    });
    const formResult =
      await this.googleFormService.collectAttendanceFormResponses(
        formResultInfo[0].formId!,
      );
    const resultMessage = `回答結果を発表します。\n土曜日：${formResult.responses.sat}\n日曜日：${formResult.responses.sun}\nよって、${formResult.win}`;
    return await this.sendMessage({
      groupId: input.groupId,
      textEventMessage: resultMessage,
    });
  }

  /**
   * createリクエストの受け皿で、カテゴリによって処理を分ける
   * @param input
   */
  async receiveCreateRequest(input: ReceivedCreateRequestInput) {
    const groupId = this.env.GroupId;
    console.log(groupId);
    if (input.category === 'MESSAGE') {
      await this.createSchedule({
        ...input,
        handler: async (input) => {
          await this.sendMessage({
            groupId,
            textEventMessage: input.message,
          });
        },
      });
    }
    // フォーム作成のリクエストが来た場合、フォーム作成と結果送信のスケジュールを作成
    if (input.category === 'FORM') {
      const formGroupId = uuidv4();
      await this.createSchedule({
        ...input,
        formGroupId,
        handler: async (input: CreateFormInput) => await this.createForm(input),
      });
      await this.createSchedule({
        ...input,
        weekday: input.resultSendWeekday + input.weekday,
        hour: input.resultSendHour,
        minute: input.resultSendMinute,
        description: 'フォーム結果送信',
        message: '回答結果を発表します。',
        category: 'RESULT',
        formGroupId,
        handler: async (input: SendFormResultInput) =>
          await this.sendFormResult(input),
      });
    }

    return 'ok';
  }

  async updateSchedule(input: UpdateScheduleInput): Promise<string> {
    const groupId = this.env.GroupId;
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        scheduleId: input.id,
      },
    });
    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    await this.prisma.schedule.update({
      where: {
        scheduleId: input.id,
      },
      data: {
        weekday:
          input.weekday === undefined || input.weekday === null
            ? null
            : this.convertDayOfWeek(input.weekday),
        hour: input.hour,
        minute: input.minute,
        message: input.message,
        description: input.description,
      },
    });

    this.schedulerRegistry.deleteCronJob(input.id);

    const minute = input.minute ?? '*';
    const hour = input.hour ?? '*';
    const weekday = input.weekday ?? '*';
    const cronTime = `0 ${minute} ${hour} * * ${weekday}`;

    const handler = (input: Schedule): (() => Promise<void>) => {
      switch (input.category) {
        case 'RESULT':
          return async () => {
            await this.sendFormResult({
              groupId,
              id: input.id,
              message: input.message,
              formGroupId: input.formGroupId,
            });
          };
        case 'MESSAGE':
          return async () => {
            await this.sendMessage({
              groupId,
              textEventMessage: input.message,
            });
          };
        case 'FORM':
          return async () => {
            await this.createForm({
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

    const onTick = handler(schedule); // <- ここでコールバック関数を生成

    const job = new CronJob(cronTime, onTick, null, false, 'Asia/Tokyo');
    this.schedulerRegistry.addCronJob(input.id, job);
    job.start();

    return 'ok';
  }

  /**
   * 指定IDのジョブを削除する。
   * @param id 削除するスケジュールID
   */
  async deleteSchedule(input: DeleteScheduleInput): Promise<string> {
    if (!this.schedulerRegistry.doesExist('cron', input.id)) {
      throw new BadRequestException(
        `ID: ${input.id} のスケジュールが存在しません。`,
      );
    }

    const job = this.schedulerRegistry.getCronJob(input.id);
    job.stop();
    this.schedulerRegistry.deleteCronJob(input.id);

    await this.prisma.schedule.deleteMany({
      where: {
        scheduleId: input.id,
      },
    });

    return 'ok';
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
      console.log(event.source.userId);
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
  async sendMessage(message?: ReceivedMessageValidatePayload): Promise<void> {
    const client = this.env.createLinebotClient();

    if (!message) {
      return;
    }

    console.log(message.groupId);

    await client.pushMessage({
      to: message.groupId, // console.log で actual groupId を確認しておく
      messages: [
        {
          type: 'textV2',
          text: '{everyone}\n' + message.textEventMessage,
          substitution: {
            everyone: {
              type: 'mention',
              mentionee: {
                type: 'all', // 全員メンション
              },
            },
          },
        },
      ],
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

  async getScheduleDirectly(): Promise<any[] | null> {
    const schedules: Schedule[] = await this.prisma.schedule.findMany();
    const jobs = [];

    for (const schedule of schedules) {
      const job = this.schedulerRegistry.getCronJob(schedule.scheduleId);

      jobs.push({
        scheduleId: schedule.scheduleId,
        description: schedule.description,
        weekday: schedule.weekday,
        hour: schedule.hour,
        minute: schedule.minute,
        message: schedule.message,
        running: job.running,
        nextDates: job.nextDates().map((date) => date.toJSDate()), // cronの次実行予定
      });
    }

    return jobs;
  }
}
