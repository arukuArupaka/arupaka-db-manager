import { IsNumber } from 'class-validator';

export class CarouselDeleteInput {
  @IsNumber()
  id: number;
}
