import { Injectable } from '@nestjs/common';
import {
  ListingItemPayload,
  ListingItemInput,
} from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { validateValue } from 'src/common/validate-value';

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
    const newItems = await Promise.all(items.map((item) => {
      const newItem:ListingItemPayload = {
        id: item.id,
        createdAt: item.createdAt,
        documentId: item.documentId,
        condition: item.condition,
        department: item.department,
        imageUrls: item.imageUrls.map((imageUrl)=>{return imageUrl.url}),
        price: item.price,
        name: item.name,
        firebaseUserId: item.firebaseUserId};
      const checkedItem = validateValue(ListingItemPayload,newItem);  
      return checkedItem;
    }));
    return newItems;
  }

  async ItemCreate(createItem: ListingItemInput): Promise<string> {
    const adjustedCreateItem = {
      //余計なプロパティの削除
      documentId: createItem.documentId,
      condition: createItem.condition,
      department: createItem.department,
      price: createItem.price,
      name: createItem.name,
      firebaseUserId: createItem.firebaseUserId,
      imageUrls:{
      create:createItem.imageUrls.map((imageUrl)=>({url:imageUrl}))
      } 
    }
    await this.prisma.listingItem.upsert({
      where: { documentId: adjustedCreateItem.documentId },
      update: adjustedCreateItem,
      create:adjustedCreateItem,
    });
    return 'OK';
  }
}