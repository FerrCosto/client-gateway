import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ImgProductsEditInput } from './sub-edit-products.dto.input';
import { Field, InputType, Int } from '@nestjs/graphql';

import { CategoryProductsEditInput } from './sub-edit-category.dto.input';

@InputType()
export class UpdateProductsInput {
  @Field(() => Int, { description: 'Id del producto a modificar' })
  @IsInt()
  id: number;
  @Field(() => String, {
    nullable: true,
    description: 'Nombre del producto a modificar',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripción del productoa modificar',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @Field(() => String, {
    nullable: true,
    description: 'Precio del producto a modificar',
  })
  @IsString()
  @IsOptional()
  price?: string;
  @Field(() => [ImgProductsEditInput], {
    nullable: true,
    description: 'Imagenes del producto a modificar',
  })
  @IsArray()
  @IsOptional()
  img_Products?: ImgProductsEditInput[];
  @Field(() => [CategoryProductsEditInput], {
    nullable: true,
    description: 'Nombre de la categoria del producto a modificar',
  })
  @IsArray()
  @IsOptional()
  categoryProducts?: CategoryProductsEditInput[];
}
