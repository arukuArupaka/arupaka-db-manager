/* eslint-disable prettier/prettier */
import { TextEventMessage, WebhookEvent } from '@line/bot-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/environments.service';
import { ReceivedMessageValidatePayload } from './interface/received-message-validate.payload';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class LineBotService {
  constructor(
    private readonly env: EnvironmentsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * 指定IDのジョブを作成する。
   * @param id ユニークなスケジュールID
   * @param dayOfWeek 曜日（0:日曜〜6:土曜）
   * @param hour 時（0-23）
   * @param minute 分（0-59）
   */
  createSchedule(
    id: string,
    dayOfWeek: number,
    hour: number,
    minute: number,
  ): string {
    if (this.schedulerRegistry.doesExist('cron', id)) {
      throw new BadRequestException(
        `ID: ${id} のスケジュールは既に存在します。`,
      );
    }

    // cron式： "分 時 * * 曜日"
    const cronTime = `${minute} ${hour} * * ${dayOfWeek}`;

    const job = new CronJob(cronTime, () => {
      this.executeTask(id);
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
}
