import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaServiceProvider } from './prisma/prisma.provider';
import { LectureModule } from './Lecture/lecture.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SearchItemModule } from './listing-item/listing-item.module';
import { DeviceTokenModule } from './device-token/device-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LectureModule,
    SearchItemModule,
    DeviceTokenModule,
  ],
  providers: [AppService, PrismaServiceProvider],
  exports: [PrismaServiceProvider],
})
export class AppModule {}
