import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeviceTokenCreateInput {
  @IsString()
  @IsNotEmpty()
  deviceToken: string;
  @IsString()
  @IsOptional()
  firebaseUserId?: string;
}
