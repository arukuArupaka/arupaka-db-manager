import { Injectable } from '@nestjs/common';
import {
  ListingItemPayload,
  RecievedListingItemPayload,
} from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchItemService {
  constructor(private readonly prisma: CustomPrismaService) {}

  async findItems(searchWord: string): Promise<ListingItemPayload[]> {
    const items = await this.prisma.listingItem.findMany({
      where: {
        name: { contains: searchWord },
      },
    });
    return items;
  }

  async ItemCreate(createItem: RecievedListingItemPayload): Promise<string> {
    await this.prisma.listingItem.upsert({
      where: { documentId: createItem.documentId },
      update: createItem,
      create: createItem,
    });
    return 'OK';
  }
}
