import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SearchItemService } from './listing-item.service';
import { ListingItemPayload } from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';

@Controller('search_item')
export class SearchItemController {
  constructor(
    private prisma: CustomPrismaService,
    private searchItemService: SearchItemService,
  ) {}

  @Get(':name')
  async getItems(@Param('name') name: string): Promise<ListingItemPayload[]> {
    //searchItem.serviceで検索メソッドをもつ型を定義して
    //その型にデータベースを写し取り、メソッドを実行し、返す
    return this.searchItemService.findItems(name);
  }

  @Post()
  CreateItem(@Body() createitem: ListingItemPayload) {
    //上記の型に商品情報追加メソッドをsearchItem.serviceで作り、それを実行する
    //Firebaseにも追加する処理を作る
  }
}
