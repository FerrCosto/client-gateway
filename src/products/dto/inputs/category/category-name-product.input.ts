import { Field, InputType } from '@nestjs/graphql';
import { CategoryNameImput, PriceProductInput } from '.';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CategoryProductsByNameInput {
  @Field(() => [CategoryNameImput], {
    description: 'Arreglo de nombre de categoria',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryNameImput)
  categories: CategoryNameImput[];
  @Field(() => PriceProductInput, {
    description: 'Precios para buscar',
    nullable: true,
  })
  @ValidateNested()
  @Type(() => PriceProductInput)
  @IsOptional()
  price?: PriceProductInput;
}
