/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentsService } from './environments.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env'] })],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
