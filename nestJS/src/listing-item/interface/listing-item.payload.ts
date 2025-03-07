import { plainToInstance } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDate,
  IsFQDN,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  validate
} from 'class-validator';

export async function validateInput<T extends object>(
  cls: new () => T,
  plain: object
): Promise<T> {
  const instance = plainToInstance(cls, plain);

  const errors = await validate(instance);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return instance;
}

const allConditions = [
'BRAND_NEW',
'LIKE_NEW',
'GOOD',
'FAIR',
'POOR',
'BAD'];

export type Condition =
  | 'BRAND_NEW' //新品、未使用
  | 'LIKE_NEW' //未使用に近い
  | 'GOOD' //目立った傷や汚れなし
  | 'FAIR' //やや傷や汚れあり
  | 'POOR' //傷や汚れあり
  | 'BAD'; //全体的に状態が悪い

const allAcademics = [
  'All'
  ,'LiberalArts'
  ,'Law'
  ,'SocialSciences'
  ,'InternationalRelations'
  ,'Literature'
  ,'Business'
  ,'PolicyScience'
  ,'Psychology'
  ,'GlobalLiberalArts'
  ,'Film'
  ,'InformationScience'
  ,'ScienceAndTechnology'
  ,'Economics'
  ,'SportsHealthScience'
  ,'FoodManagement'
  ,'LifeSciences'
  ,'Pharmacy'];

export type Academics =
  | 'All'
  | 'LiberalArts'
  | 'Law'
  | 'SocialSciences'
  | 'InternationalRelations'
  | 'Literature'
  | 'Business'
  | 'PolicyScience'
  | 'Psychology'
  | 'GlobalLiberalArts'
  | 'Film'
  | 'InformationScience'
  | 'ScienceAndTechnology'
  | 'Economics'
  | 'SportsHealthScience'
  | 'FoodManagement'
  | 'LifeSciences'
  | 'Pharmacy';

export class RecievedListingItemPayload {
  @IsString()
  documentId: string; //FirebaseにおけるID
  @IsOptional()
  @IsDate()
  purchasedAt?: Date; //購入した日時
  @IsOptional()
  @IsString()
  purchasedUserId?: string; //購入したユーザーのid
  @IsIn(allConditions)
  condition: Condition; //商品の状態
  @IsIn(allAcademics)
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
}

export class ListingItemPayload extends RecievedListingItemPayload {
  @IsInt()
  id: number; //ID
  @IsDate()
  createdAt: Date; //出品された日時
}