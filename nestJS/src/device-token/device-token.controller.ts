import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DeviceTokenPayload } from './interface/device-token.payload';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenDeleteInput } from './interface/device-token-delete.input';
import { DeviceTokenCreateInput } from './interface/device-token-create.input';
import { PushNotificationInput } from './interface/push-notification.input';

@Controller('device_token')
export class DeviceTokenController {
  constructor(private deviceTokenService: DeviceTokenService) {}

  @Get('get_all')
  async getAllDeviceToken(): Promise<DeviceTokenPayload[]> {
    return await this.deviceTokenService.getAllDeviceToken();
  }

  @Post('create')
  async createDeviceToken(
    @Body() createDeviceToken: DeviceTokenCreateInput,
  ): Promise<string> {
    return await this.deviceTokenService.createDeviceToken(createDeviceToken);
  }

  @Post('push_notification')
  async pushNotification(
    @Body() pushNotificationInput: PushNotificationInput,
  ): Promise<string> {
    return await this.deviceTokenService.pushNotification(
      pushNotificationInput,
    );
  }

  @Delete('delete')
  async deleteDeviceToken(
    @Query() query: DeviceTokenDeleteInput,
  ): Promise<string> {
    return await this.deviceTokenService.deleteDeviceToken(query);
  }
}
