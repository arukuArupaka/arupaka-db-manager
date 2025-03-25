import { IsString, IsNotEmpty } from "class-validator";

export class DeviceTokenDeleteInput {
    @IsString()
    @IsNotEmpty()
    deviceToken:string;
}