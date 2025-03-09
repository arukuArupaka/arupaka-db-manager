/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class BuildingAndClassroomsGetInput {
  @IsString()
  @Type(() => String)
  buildingName: string;
}
