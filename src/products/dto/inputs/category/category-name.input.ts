import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CategoryNameImput {
  @Field(() => String, { description: 'Nombre de la categoria' })
  @IsString()
  name: string;
}
