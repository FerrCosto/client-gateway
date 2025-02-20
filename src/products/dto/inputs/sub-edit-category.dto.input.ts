import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CategoryProductsEditInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Id de la imagen del producto a modificar',
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number;
  @Field(() => String, {
    description: 'El nombre de la categoria',
    name: 'name',
  })
  @IsOptional()
  @IsString()
  name?: string;
  @Field(() => Boolean, {
    nullable: true,
    description: 'Si se desea es eliminar la imagen',
  })
  @IsBoolean()
  @IsOptional()
  delete?: boolean = false;
}
