import { BadRequestException, Injectable } from '@nestjs/common';
import { ListingItemPayload } from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import { validateValue } from 'src/common/validate-value';
import { ListingItemSearchInput } from './interface/listingitem-search.input';
import { ListingItemCreateInput } from './interface/listing-item-create.input';

@Injectable()
export class SearchItemService {
  constructor(private readonly prisma: CustomPrismaService) {}

  async getAllItems(): Promise<ListingItemPayload[]> {
    const items = await this.prisma.listingItem.findMany({
      //全部select(imageurl含め)
      select: {
        id: true,
        documentId: true,
        purchasedAt: true,
        purchasedUserId: true,
        condition: true,
        createdAt: true,
        department: true,
        description: true,
        price: true,
        name: true,
        firebaseUserId: true,
        imageUrls: true,
      },
    });
    const newItems = await Promise.all(
      items.map((item) => {
        const newItem: ListingItemPayload = {
          id: item.id,
          createdAt: item.createdAt,
          documentId: item.documentId,
          condition: item.condition,
          department: item.department,
          imageUrls: item.imageUrls.map((imageUrl) => {
            return imageUrl.url;
          }),
          price: item.price,
          name: item.name,
          firebaseUserId: item.firebaseUserId,
        };
        const checkedItem = validateValue(ListingItemPayload, newItem);
        return checkedItem;
      }),
    );
    return newItems;
  }

  async searchItems(
    query: ListingItemSearchInput,
  ): Promise<ListingItemPayload[]> {
    const items = await this.prisma.listingItem.findMany({
      where: {
        name: { contains: query.name },
      },
      //全部select(imageurl含め)
      select: {
        id: true,
        documentId: true,
        purchasedAt: true,
        purchasedUserId: true,
        condition: true,
        createdAt: true,
        department: true,
        description: true,
        price: true,
        name: true,
        firebaseUserId: true,
        imageUrls: true,
      },
    });
    const newItems = await Promise.all(
      items.map((item) => {
        const newItem: ListingItemPayload = {
          id: item.id,
          createdAt: item.createdAt,
          documentId: item.documentId,
          condition: item.condition,
          department: item.department,
          imageUrls: item.imageUrls.map((imageUrl) => {
            return imageUrl.url;
          }),
          price: item.price,
          name: item.name,
          firebaseUserId: item.firebaseUserId,
        };
        const checkedItem = validateValue(ListingItemPayload, newItem);
        return checkedItem;
      }),
    );
    return newItems;
  }

  async createItem(createItem: ListingItemCreateInput): Promise<string> {
    const imageUrls = await this.prisma.imageUrl.findMany({
      where: {
        url: {
          in: createItem.imageUrls,
        },
      },
    });
    if (imageUrls.length > 0) {
      throw new BadRequestException();
    }
    const adjustedCreateItem = {
      //image配列をimageテーブルのオブジェクトの配列に変更
      documentId: createItem.documentId,
      condition: createItem.condition,
      department: createItem.department,
      price: createItem.price,
      name: createItem.name,
      firebaseUserId: createItem.firebaseUserId,
      imageUrls: {
        create: createItem.imageUrls.map((imageUrl) => ({ url: imageUrl })),
      },
    };
    await this.prisma.listingItem.create({
      data: adjustedCreateItem,
    });
    return 'OK';
  }
}
