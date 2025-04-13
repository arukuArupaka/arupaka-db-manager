/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class ReceivedMessageValidatePayload {
  @IsString()
  groupId: string;

  @IsString()
  textEventMessage: string;
}
