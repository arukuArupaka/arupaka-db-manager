import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class ListingItemSearchInput {
  @IsString()
  @Type(() => String)
  name: string;
}
