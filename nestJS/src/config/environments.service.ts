/* eslint-disable prettier/prettier */
import { messagingApi } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentsService {
  constructor(private configService: ConfigService) {}

  get ChannelSecret(): string {
    const lineChannelSecret = this.configService.get('LINE_CHANNEL_SECRET');
    if (!lineChannelSecret) {
      throw new Error('Channel Secret is not defined');
    }
    return lineChannelSecret;
  }
  get ChannelAccessToken(): string | undefined {
    const lineChannelAccessToken = this.configService.get(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );
    if (!lineChannelAccessToken) {
      throw new Error('Channel Access Token is not defined');
    }
    return lineChannelAccessToken;
  }

  get GroupId(): string {
    const groupId = this.configService.get('LINE_GROUP_ID');
    if (!groupId) {
      throw new Error('Group ID is not defined');
    }
    return groupId;
  }

  createLinebotClient() {
    const { MessagingApiClient } = messagingApi;
    const channelAccessToken = this.ChannelAccessToken;
    if (!channelAccessToken) {
      throw new Error('Channel Access Token is not defined');
    }
    const token = { channelAccessToken };
    return new MessagingApiClient(token);
  }
}
