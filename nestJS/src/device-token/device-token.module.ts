import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenController } from './device-token.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService],
})
export class DeviceTokenModule {}
