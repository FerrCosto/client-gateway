import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ImgProductsInput } from './sub-products.dto.input';

@InputType()
export class CreateProdctsInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
  @Field(() => String)
  @IsString()
  price: string;
  @Field(() => [ImgProductsInput])
  @IsArray()
  img_Products: ImgProductsInput[];
  //   @IsObject()
  //   categoryProducts: CategoryProducts;
}
