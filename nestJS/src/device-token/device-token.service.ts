import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceTokenPayload } from './interface/device-token.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { DeviceTokenUpsertInput } from './interface/device-token-upsert.input';
import { DeviceTokenDeleteInput } from './interface/device-token-delete.input';
import { validateValue } from 'src/common/validate-value';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

    async createDeviceToken(upsertDeviceToken:DeviceTokenUpsertInput):Promise<string>{
        const UpsertedObject = await this.prismaService.deviceToken.upsert({
            where: {
                deviceToken: upsertDeviceToken.deviceToken
            },
            create: upsertDeviceToken,
            update: {},
        })
        console.log(UpsertedObject);
        if (!UpsertedObject){
            return "creation failed";
        }
        return "upsert completed";  
    }

    async deleteDeviceToken(deleteDeviceToken:DeviceTokenDeleteInput):Promise<string>{
        try{    
            await this.prismaService.deviceToken.delete({
                where:{
                    deviceToken: deleteDeviceToken.deviceToken,
                }
            })
            return "delete completed";
        }catch(e){
            if (e instanceof PrismaClientKnownRequestError){
                throw new NotFoundException(e)
            }
        }
    }
}
