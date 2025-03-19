import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DeviceTokenPayload} from './interface/device-token.payload';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenDeleteInput } from './interface/device-token-delete.input';
import { DeviceTokenUpsertInput } from './interface/device-token-upsert.input';

@Controller('device_token')
export class DeviceTokenController {
    constructor(private deviceTokenService:DeviceTokenService){}

    @Get('get_all')
    async getAllDeviceToken():Promise<DeviceTokenPayload[]>{
        return await this.deviceTokenService.getAllDeviceToken();
    }

    @Post('create')
    async createDeviceToken(@Body() upsertDeviceToken:DeviceTokenUpsertInput,):Promise<string>{
        return await this.deviceTokenService.createDeviceToken(upsertDeviceToken);
    }

    @Delete('delete')
    async deleteDeviceToken(@Query() query:DeviceTokenDeleteInput):Promise<string>{
        return await this.deviceTokenService.deleteDeviceToken(query);
    }
}
