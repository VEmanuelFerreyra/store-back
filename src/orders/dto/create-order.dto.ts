import { IsInt, IsArray, ValidateNested, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
