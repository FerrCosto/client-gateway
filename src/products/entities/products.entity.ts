import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ImgProducts } from './';
// import { CategoryProductsDto } from '../dtos/category';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String)
  date_update: string;
  @Field(() => String)
  price: string;
  @Field(() => [ImgProducts])
  img_products: ImgProducts[];

  //   categoryproducts: CategoryProductsDto;
}
