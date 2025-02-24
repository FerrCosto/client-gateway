import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ImgProductsInput } from './sub-products.dto.input';
import { CategoryProductsInput } from './category';

@InputType()
export class CreateProdctsInput {
  @Field(() => String, { description: 'Nombre del producto' })
  @IsString()
  @MinLength(1)
  name: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripción del producto si deberia tener',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Number, {
    description: 'Cantidad del producto',
  })
  @IsInt()
  @Min(5)
  @IsPositive()
  inStock: number;
  @Field(() => String, { description: 'Precio del Producto' })
  @IsString()
  price: string;
  @Field(() => [ImgProductsInput], {
    description: 'Imagenes del producto asociado',
  })
  @IsArray()
  img_Products: ImgProductsInput[];
  @Field(() => [CategoryProductsInput], {
    description: 'Categoria del producto',
  })
  @IsArray()
  categoryProducts: CategoryProductsInput[];
}
