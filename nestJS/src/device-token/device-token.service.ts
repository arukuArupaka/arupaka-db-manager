import { Injectable } from '@nestjs/common';
import { DeviceTokenPayload } from './interface/device-token.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { UpsertDeviceTokenInput } from './interface/upsert-device-token.input';
import { DeleteDeviceTokenInput } from './interface/delete-device-token.input';
import { validateValue } from 'src/common/validate-value';

@Injectable()
export class DeviceTokenService {
    constructor(private readonly prismaService:CustomPrismaService){}

    async getAllDeviceToken():Promise<DeviceTokenPayload[]>{
        const allDeviceTokens:DeviceTokenPayload[] = await this.prismaService.deviceToken.findMany();
        const validatedDeviceTokens = await Promise.all(allDeviceTokens.map((deviceToken)=>{
            return validateValue(DeviceTokenPayload,deviceToken);
        }))
        return validatedDeviceTokens;
    }

    async upsertDeviceToken(upsertDeviceToken:UpsertDeviceTokenInput):Promise<String>{
        await this.prismaService.deviceToken.upsert({
            where: {
                deviceToken: upsertDeviceToken.deviceToken
            },
            create: upsertDeviceToken,
            update: upsertDeviceToken,
        })
        return "upsert completed";
    }

    async deleteDeviceToken(deleteDeviceToken:DeleteDeviceTokenInput):Promise<String>{
        const deletingDeviceToken = await this.prismaService.deviceToken.findUnique(
            {
                where:{
                    deviceToken:deleteDeviceToken.deviceToken,
        }});

        if(!deletingDeviceToken){
            return "Such devicetoken doesn`t exist."
        }
        await this.prismaService.deviceToken.delete({
            where:{
                deviceToken: deleteDeviceToken.deviceToken,
            }
        })
        return "delete completed";
    }
}
