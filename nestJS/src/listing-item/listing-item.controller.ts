import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchItemService } from './listing-item.service';
import { ListingItemPayload } from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';

@Controller('listing_item')
export class SearchItemController {
  constructor(private searchItemService: SearchItemService) {}

  @Get('search_item/:name')
  async getItems(@Query('name') name: string): Promise<ListingItemPayload[]> {
    return this.searchItemService.findItems(name);
  }

  @Post('create_item')
  async CreateItem(@Body() createItem: ListingItemPayload): Promise<string> {
    return this.searchItemService.ItemCreate(createItem);
  }
}
