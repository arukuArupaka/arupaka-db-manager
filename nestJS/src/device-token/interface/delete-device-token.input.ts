import { IsString, IsNotEmpty } from "class-validator";

export class DeleteDeviceTokenInput {
    @IsString()
    @IsNotEmpty()
    deviceToken:string;
}