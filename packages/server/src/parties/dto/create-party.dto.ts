import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreatePartyDto {
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  incrementOptions: number[];
}
