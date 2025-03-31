import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DeviceTokenPayload {
  @IsNumber()
  id: number;
  @IsString()
  deviceToken: string;
  @IsString()
  @IsOptional()
  firebaseUserId?: string;
}
