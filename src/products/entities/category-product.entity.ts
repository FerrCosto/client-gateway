import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryProducts {
  @Field(() => ID, { description: 'Id de la categoria' })
  id: number;
  @Field(() => String, { description: 'Nombre de la categoria' })
  name: string;
}
