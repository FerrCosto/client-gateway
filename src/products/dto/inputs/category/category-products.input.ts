import { Field, InputType } from '@nestjs/graphql';

import { IsString } from 'class-validator';

@InputType()
export class CategoryProductsInput {
  @Field(() => String, {
    description: 'El nombre de la categoria',
    name: 'name',
  })
  @IsString()
  name: string;
}
