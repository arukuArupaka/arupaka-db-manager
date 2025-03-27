import { IsInstance, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PushNotificationInput {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsInstance(Object)
  data: { screen: string; params: Object };
}
