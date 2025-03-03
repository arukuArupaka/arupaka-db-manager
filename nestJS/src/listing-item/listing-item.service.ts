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
    validate(createItem).then((errors)=>{
      if(errors.length > 0){
        return errors;
      }});
    const adjustedCreateItem = {
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
      where: { documentId: createItem.documentId },
      update: adjustedCreateItem,
      create: {
        documentId: createItem.documentId,
        condition: createItem.condition,
        department: createItem.department,
        price: createItem.price,
        name: createItem.name,
        firebaseUserId: createItem.firebaseUserId,
        imageUrls:{
          create:createItem.imageUrls.map((imageUrl)=>({url:imageUrl}))
        }
      },
    });
    return 'OK';
}}
