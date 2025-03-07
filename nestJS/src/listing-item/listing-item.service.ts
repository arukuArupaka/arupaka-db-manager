import { Injectable } from '@nestjs/common';
import {
  ListingItemPayload,
  RecievedListingItemPayload,
  validateInput,
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
      select:{
        id:true,
        documentId:true,
        purchasedAt:true,
        purchasedUserId:true,
        condition:true,
        createdAt:true,
        department:true,
        description:true,
        price:true,
        name:true,
        firebaseUserId:true,
        imageUrls:true
      }});
    const newitems = items.map((item) => {
      const newitem:ListingItemPayload = {
        id: item.id,
        createdAt: item.createdAt,
        documentId: item.documentId,
        condition: item.condition,
        department: item.department,
        imageUrls: item.imageUrls.map((imageUrl)=>{return imageUrl.url}),
        price: item.price,
        name: item.name,
        firebaseUserId: item.firebaseUserId};
      return newitem;
    })
    return newitems;
  }

  async ItemCreate(createItem: RecievedListingItemPayload): Promise<string> {
    try{
      const validatedCreateItem = await validateInput(RecievedListingItemPayload,createItem)
        .catch((error:Error)=>{
          console.log(error); 
          throw error;});
      const adjustedCreateItem = {
        //余計なプロパティの削除
        documentId: validatedCreateItem.documentId,
        condition: validatedCreateItem.condition,
        department: validatedCreateItem.department,
        price: validatedCreateItem.price,
        name: validatedCreateItem.name,
        firebaseUserId: validatedCreateItem.firebaseUserId,
        imageUrls:{
        create:validatedCreateItem.imageUrls.map((imageUrl)=>({url:imageUrl}))
        } 
      }
      await this.prisma.listingItem.upsert({
        where: { documentId: adjustedCreateItem.documentId },
        update: adjustedCreateItem,
        create:adjustedCreateItem,
      });
      return 'OK';

    }catch(error){
      if (error instanceof Error){
        return error.message;
      }
    }
  }
}