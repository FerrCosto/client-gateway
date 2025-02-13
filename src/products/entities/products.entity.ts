import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ImgProducts } from './';
// import { CategoryProductsDto } from '../dtos/category';

@ObjectType()
export class Product {
  @Field(() => ID, { description: 'Id del producto' })
  id: number;
  @Field(() => String, { description: 'Nombre del producto' })
  name: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripción del producto',
  })
  description?: string;
  @Field(() => String, {
    description: 'Slug del producto',
  })
  slug: string;
  @Field(() => String, { description: 'Fecha de modificacion del producto' })
  date_update: string;
  @Field(() => String, { description: 'Precio del del producto' })
  price: string;
  @Field(() => [ImgProducts], { description: 'Imagenes del producto' })
  img_products: ImgProducts[];

  //   categoryproducts: CategoryProductsDto;
}
