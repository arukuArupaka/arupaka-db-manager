import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ExpoPushPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  to: string[];
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  body: string;
  @IsInstance(Object)
  data: { screen: string; params: Object };
}
