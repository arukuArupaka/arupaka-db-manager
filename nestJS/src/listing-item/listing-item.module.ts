import { Module } from '@nestjs/common';
import { SearchItemController } from './listing-item.controller';
import { SearchItemService } from './listing-item.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchItemController],
  providers: [SearchItemService],
})
export class SearchItemModule {}
