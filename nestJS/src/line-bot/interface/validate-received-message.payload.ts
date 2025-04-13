/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class validateReceivedMessagePayload {
  @IsString()
  groupId: string;

  @IsString()
  textEventMessage: string;
}
