import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeviceTokenPayload } from './interface/device-token.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { DeviceTokenCreateInput } from './interface/device-token-create.input';
import { DeviceTokenDeleteInput } from './interface/device-token-delete.input';
import { validateValue } from 'src/common/validate-value';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PushNotificationInput } from './interface/push-notification.input';
import { ExpoPushPayload } from './interface/expo-push.payload';
import { chunkArray } from 'src/common/chunkArray';

const chunkStrArr100 = chunkArray<string>(100);

const createExpoPushPayload = (
  pushNotificationInput: PushNotificationInput,
  deviceTokens: string[],
): ExpoPushPayload => {
  return {
    to: deviceTokens,
    title: pushNotificationInput.title,
    body: pushNotificationInput.message,
    data: pushNotificationInput.data,
  };
};

const fetchExpoPush = async (expoPushPayload: ExpoPushPayload) => {
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expoPushPayload),
  });
  console.log(res);
};

const pickUpDeviceToken = (deviceTokens: DeviceTokenPayload): string => {
  return deviceTokens.deviceToken;
};
@Injectable()
export class DeviceTokenService {
  constructor(private readonly prisma: CustomPrismaService) {}

  async getAllDeviceToken(): Promise<DeviceTokenPayload[]> {
    const allDeviceTokens: DeviceTokenPayload[] =
      await this.prisma.deviceToken.findMany();
    const validatedDeviceTokens = await Promise.all(
      allDeviceTokens.map((deviceToken) => {
        return validateValue(DeviceTokenPayload, deviceToken);
      }),
    );
    return validatedDeviceTokens;
  }

  async createDeviceToken(
    createDeviceToken: DeviceTokenCreateInput,
  ): Promise<string> {
    try {
      await this.prisma.deviceToken.create({
        data: createDeviceToken,
      });
      return 'create completed';
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  async pushNotification(
    pushNotificationInput: PushNotificationInput,
  ): Promise<string> {
    try {
      const deviceTokenObjects = await this.prisma.deviceToken.findMany();
      const deviceTokens = deviceTokenObjects.map(pickUpDeviceToken);
      const expoPushPayloads = chunkStrArr100(deviceTokens).map(
        (deviceTokenArray) => {
          return createExpoPushPayload(pushNotificationInput, deviceTokenArray);
        },
      );
      await Promise.all(expoPushPayloads.map(fetchExpoPush));
      return 'push notification completed';
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  async deleteDeviceToken(
    deleteDeviceToken: DeviceTokenDeleteInput,
  ): Promise<string> {
    try {
      await this.prisma.deviceToken.delete({
        where: {
          deviceToken: deleteDeviceToken.deviceToken,
        },
      });
      return 'delete completed';
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }
}
