import { Injectable } from '@nestjs/common';
import {
  ListingItemPayload,
  RecievedListingItemPayload,
} from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { validate } from 'class-validator';

@Injectable()
export class SearchItemService {
  constructor(private readonly prisma: CustomPrismaService) {}

  async findItems(searchWord: string): Promise<ListingItemPayload[]> {
    const items = await this.prisma.listingItem.findMany({
      where: {
        name: { contains: searchWord },
      },
      //全部select(imageurl含め)
      select:{id:true,documentId:true,purchasedAt:true,purchasedUserId:true,condition:true,createdAt:true,department:true,description:true,price:true,name:true,firebaseUserId:true,imageUrls:true}
    });
    return items;
  }

  async ItemCreate(createItem: RecievedListingItemPayload): Promise<string> {
    validate(createItem).then((errors)=>{
      if(errors.length > 0){
        return errors;
      }})
    await this.prisma.listingItem.upsert({
      where: { documentId: createItem.documentId },
      update: createItem,
      create: createItem,
    });
    return 'OK';
  }
}
