import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class CreateOrderDetailDto {
  @ApiProperty({
    name: 'productId',
    description: 'Id del producto',
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  productId: number;
  @ApiProperty({
    name: 'quantity',
    description: 'Cantidad de la orden de los productos',
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    name: 'detail',
    description: 'Arreglo de detalles de la orden',
    type: () => [CreateOrderDetailDto],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  detail: CreateOrderDetailDto[];
}
