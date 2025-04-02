import { Module } from '@nestjs/common';
import { SearchItemController } from './listing-item.controller';
import { SearchItemService } from './listing-item.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/common/guards/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SearchItemController],
  providers: [SearchItemService],
})
export class SearchItemModule {}
