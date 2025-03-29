import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchItemService } from './listing-item.service';
import { ListingItemPayload } from './interface/listing-item.payload';
import { ListingItemSearchInput } from './interface/listingitem-search.input';
import { ListingItemCreateInput } from './interface/listing-item-create.input';

@Controller('listing_item')
export class SearchItemController {
  constructor(private searchItemService: SearchItemService) {}

  @Get('search_item')
  async searchItems(
    @Query() query: ListingItemSearchInput,
  ): Promise<ListingItemPayload[]> {
    return this.searchItemService.searchItems(query);
  }

  @Post('create_item')
  async createItem(
    @Body() createItem: ListingItemCreateInput,
  ): Promise<string> {
    return this.searchItemService.createItem(createItem);
  }
}
