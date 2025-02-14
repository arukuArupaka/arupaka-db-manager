import { Injectable } from '@nestjs/common';
import { ListingItemPayload } from './interface/listing-item.payload';
import { CustomPrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchItemService {
  constructor(private readonly prisma: CustomPrismaService) {}

  //検索する商品名を受け取り、データベースから探し出し、そのidを返すメソッド
  async findItems(searchName: string): Promise<ListingItemPayload[]> {
    const items = await this.prisma.listingItem.findMany();
    const filteredItems = items.filter(
      (item) => item.name.indexOf(searchName) !== -1,
    );
    return filteredItems;
  }

  //商品情報を受け取り、データベースに追加するメソッド
  createItems() {}
}
