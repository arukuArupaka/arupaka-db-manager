import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DeviceTokenPayload} from './interface/device-token.payload';
import { DeviceTokenService } from './device-token.service';
import { DeleteDeviceTokenInput } from './interface/delete-device-token.input';
import { UpsertDeviceTokenInput } from './interface/upsert-device-token.input';

@Controller('device_token')
export class DeviceTokenController {
    constructor(private deviceTokenService:DeviceTokenService){}

    @Get('get_all')
    async getAllDeviceToken():Promise<DeviceTokenPayload[]>{
        return await this.deviceTokenService.getAllDeviceToken();
    }

    @Post('upsert')
    async upsertDeviceToken(@Body() upsertDeviceToken:UpsertDeviceTokenInput,):Promise<string>{
        console.log(upsertDeviceToken instanceof UpsertDeviceTokenInput,upsertDeviceToken)
        return await this.deviceTokenService.upsertDeviceToken(upsertDeviceToken);
    }

    @Delete('delete')
    async deleteDeviceToken(@Query() query:DeleteDeviceTokenInput):Promise<string>{
        return await this.deviceTokenService.deleteDeviceToken(query);
    }
}
