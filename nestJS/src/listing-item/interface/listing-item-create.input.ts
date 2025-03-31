import { Academics, Condition } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ListingItemCreateInput {
  @IsString()
  documentId: string; //FirebaseにおけるID
  @IsEnum(Condition)
  condition: Condition; //商品の状態
  @IsEnum(Academics)
  department: Academics; //学部
  @IsOptional()
  @IsString()
  description?: string; //商品の説明
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  imageUrls: string[];
  @IsInt()
  @Min(0)
  price: number; //商品の価格
  @IsString()
  name: string; //商品
  @IsString()
  firebaseUserId: string; //ユーザーID
}
