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
    upsertDeviceToken: DeviceTokenCreateInput,
  ): Promise<string> {
    try {
      this.prisma.deviceToken.create({
        data: upsertDeviceToken,
      });
      return 'create completed';
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
