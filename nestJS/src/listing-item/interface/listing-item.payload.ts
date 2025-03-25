import { Academics, Condition } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ListingItemPayload {
  @IsString()
  documentId: string; //FirebaseにおけるID
  @IsOptional()
  @IsDate()
  purchasedAt?: Date; //購入した日時
  @IsOptional()
  @IsString()
  purchasedUserId?: string; //購入したユーザーのid
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
  @IsString({each:true})
  imageUrls:string[];
  @IsInt()
  @Min(0)
  price: number; //商品の価格
  @IsString()
  name: string; //商品
  @IsString()
  firebaseUserId: string; //ユーザーID
  @IsInt()
  id: number; //ID
  @IsDate()
  createdAt: Date; //出品された日時
}