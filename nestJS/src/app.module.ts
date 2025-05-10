import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaServiceProvider } from './prisma/prisma.provider';
import { LectureModule } from './Lecture/lecture.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SearchItemModule } from './listing-item/listing-item.module';
import { DeviceTokenModule } from './device-token/device-token.module';
import { AuthModule } from './common/guards/auth.module';
import { LineBotModule } from './line-bot/line-bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CarouselService } from './carousel/carousel.service';
import { CarouselController } from './carousel/carousel.controller';
import { CarouselModule } from './carousel/carousel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LectureModule,
    SearchItemModule,
    DeviceTokenModule,
    AuthModule,
    LineBotModule,
    ScheduleModule.forRoot(),
    CarouselModule,
  ],
  providers: [AppService, PrismaServiceProvider, CarouselService],
  exports: [PrismaServiceProvider],
  controllers: [CarouselController],
})
export class AppModule {}
