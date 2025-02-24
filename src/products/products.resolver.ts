import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product } from './entities/products.entity';
import { CreateProdctsInput, UpdateProductsInput } from './dto/inputs';
import { Inject, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CategoryProductsInput, FindByValueInput } from './dto/inputs/category';
import { CategoryProducts } from './entities';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';
import { CurrentUser } from 'src/auth/interfaces';
import { Roles } from 'src/auth/enums/roles-user.enum';
@UseGuards(AuthGuard)
@Resolver(() => Product)
export class ProductsResolver {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Mutation(() => CategoryProducts, {
    name: 'createCategory',
    description: 'Creacion del producto',
  })
  createCategory(
    @Args('createProductInput') categoryProductsInput: CategoryProductsInput,
    @CurrentUsers([Roles.ADMIN]) admin: CurrentUser,
  ) {
    console.log({ admin });
    return this.client.send('product.category.create', categoryProductsInput);
  }

  @Query(() => [CategoryProducts], {
    name: 'findAllCategory',
    description: 'Consulta de las categorias',
  })
  findAllCategories() {
    return this.client.send('product.category.finAll', {});
  }

  @Query(() => CategoryProducts, {
    name: 'findOneCategory',
    description: 'Consultar una categoria por id o nombre',
  })
  findOne(
    @Args('value', { type: () => FindByValueInput }) value: FindByValueInput,
  ) {
    return this.client.send('product.category.findOne', value);
  }

  @Mutation(() => CategoryProducts, {
    name: 'deleteCategory',
    description: 'Eliminacion de la categoria por medio del nombre',
  })
  deleteCategory(
    @Args('name') name: string,
    @CurrentUsers([Roles.ADMIN]) admin: CurrentUser,
  ) {
    return this.client.send('product.category.delete', name);
  }

  @Mutation(() => Product, {
    name: 'createProduct',
    description: 'Creación de un producto',
  })
  createProduct(
    @Args('updateProductInput') createProductInput: CreateProdctsInput,
    @CurrentUsers([Roles.ADMIN]) admin: CurrentUser,
  ) {
    return this.client.send('product.create', createProductInput);
  }
  @Query(() => [Product], {
    name: 'findAllProducts',
    description: 'Consulta de todos los productos ',
  })
  findAllProducts() {
    return this.client.send('product.findAll', {});
  }
  @Query(() => Product, {
    name: 'findOneProduct',
    description: 'Consulta de un producto por medio del id',
  })
  findOneProduct(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) admin: CurrentUser,
  ) {
    return this.client.send('product.findOne', id);
  }

  @Query(() => Product, {
    name: 'findOneProductBySlug',
    description: 'Consulta de un producto por medio del id',
  })
  findOneBySlugProduct(
    @Args('slug', { type: () => String }) slug: string,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) admin: CurrentUser,
  ) {
    return this.client.send('product.findOneBySlug', slug);
  }

  @Mutation(() => Product, {
    name: 'updateProduct',
    description: 'Modifiación de un producto ',
  })
  updateProduct(
    @Args('updateProductInput') updateProductsInput: UpdateProductsInput,
    @CurrentUsers([Roles.ADMIN]) admin: CurrentUser,
  ) {
    return this.client.send('product.update', updateProductsInput);
  }
  @Mutation(() => Product, {
    name: 'deleteProduct',
    description: 'Eliminacion del producto por medio del id ',
  })
  removeProduct(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUsers([Roles.ADMIN]) admin: CurrentUser,
  ) {
    return this.client.send('product.delete', id);
  }
}
