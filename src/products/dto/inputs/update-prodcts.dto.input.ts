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
// import { CategoryProductsDto } from './category';

@InputType()
export class UpdateProductsInput {
  @Field(() => Int)
  @IsInt()
  id: number;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  price?: string;
  @Field(() => [ImgProductsEditInput], { nullable: true })
  @IsArray()
  @IsOptional()
  img_Products?: ImgProductsEditInput[];

  //   @IsObject()
  //   @IsOptional()
  //   categoryProducts?: CategoryProductsDto;
}
