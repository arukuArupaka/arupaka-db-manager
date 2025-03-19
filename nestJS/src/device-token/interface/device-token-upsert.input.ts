import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DeviceTokenUpsertInput {
    @IsString()
    @IsNotEmpty()
    deviceToken:string;
    @IsString()
    @IsOptional()
    firebaseUserId?:string;
}
    