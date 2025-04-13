/* eslint-disable prettier/prettier */
import { TextEventMessage, WebhookEvent } from '@line/bot-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/environments.service';
import { ReceivedMessageValidatePayload } from './interface/received-message-validate.payload';
import { SchedulerRegistry } from '@nestjs/schedule';

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

    this.logger.log(`スケジュールID[${id}]を作成: cron ${cronTime}`);

    const job = new CronJob(cronTime, () => {
      this.executeTask(id);
    });

    // SchedulerRegistry にジョブを登録
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

    if (messageFunction === '@利用開始') {
      return [
        {
          groupId: groupId,
          textEventMessage: `承りました。\n利用開始するには、以下のURLにアクセスをし、ユーザー登録、サークル作成を完了させてください。\nhttp://tunagaru.creativegrid.co.jp?aki=${groupId}`,
        },
      ];
    }

    if (messageFunction === '@アナウンス') {
      const regionNames: string[] = [];
      // 〇〇:××　っていう文字列を : で分割して、××の部分を取得
      const region = splitedMessageContent
        .filter((el) => el.includes('地域'))
        .join('')
        .split(':')[1];
      const genre = splitedMessageContent
        .filter((el) => el.includes('ジャンル'))
        .join('')
        .split(':')[1];
      const university = splitedMessageContent
        .filter((el) => el.includes('大学'))
        .join('')
        .split(':')[1];
      const message = splitedMessageContent
        .filter((el) => el.includes('メッセージ'))
        .join('')
        .split(':')[1];

      const splitedRegion = region ? region.split('&') : [];
      const genreNames = genre ? genre.split('&') : [];
      const universityNames = university ? university.split('&') : [];

      splitedRegion.forEach((region) => {
        // 指定された地域名が地方という単位だった場合
        if (Object.keys(regionPrefectureMap).includes(region)) {
          const prefectures: string[] = regionPrefectureMap[region];
          regionNames.push(...prefectures);
        } else {
          regionNames.push(region);
        }
      });

      const getCirclesInput: CirclesGetInput = {
        regionNames: regionNames,
        genreNames: genreNames,
        universityNames: universityNames,
      };
      const circles = await this.circleService.getCircles(getCirclesInput);

      if (circles.length === 0) {
        return [
          {
            groupId: groupId,
            textEventMessage: '該当するサークルが見つかりませんでした。',
          },
        ];
      }
      const responseContent = circles
        .filter((circle) => circle.lineGroupId !== undefined)
        .map((circle) => {
          return {
            groupId: circle.lineGroupId!,
            textEventMessage: message,
          };
        });
      return responseContent;
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
