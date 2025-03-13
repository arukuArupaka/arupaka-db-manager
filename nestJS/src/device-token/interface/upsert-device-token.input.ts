import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpsertDeviceTokenInput {
    @IsString()
    @IsNotEmpty()
    deviceToken:string;
    @IsString()
    @IsOptional()
    firebaseUserId?:string;
}
    