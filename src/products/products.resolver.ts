import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product } from './entities/products.entity';
import { CreateProdctsInput, UpdateProductsInput } from './dto/inputs';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CategoryProductsInput, FindByValueInput } from './dto/inputs/category';
import { CategoryProducts } from './entities';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Mutation(() => CategoryProducts, { name: 'createCategory' })
  createCategory(
    @Args('createProductInput') categoryProductsInput: CategoryProductsInput,
  ) {
    return this.client.send('product.category.create', categoryProductsInput);
  }

  @Query(() => [CategoryProducts], { name: 'findAllCategory' })
  findAllCategories() {
    return this.client.send('product.category.finAll', {});
  }

  @Query(() => CategoryProducts, { name: 'findOneCategory' })
  findOne(
    @Args('value', { type: () => FindByValueInput }) value: FindByValueInput,
  ) {
    return this.client.send('product.category.findOne', value);
  }

  @Mutation(() => CategoryProducts, { name: 'deleteCategory' })
  deleteCategory(@Args('name') name: string) {
    return this.client.send('product.category.delete', name);
  }

  @Mutation(() => Product, { name: 'createProduct' })
  createProduct(
    @Args('updateProductInput') createProductInput: CreateProdctsInput,
  ) {
    return this.client.send('product.create', createProductInput);
  }
  @Query(() => [Product], { name: 'findAllProducts' })
  findAllProducts() {
    return this.client.send('product.findAll', {});
  }
  @Query(() => Product, { name: 'findOneProduct' })
  findOneProduct(@Args('id', { type: () => Int }) id: number) {
    return this.client.send('product.findOne', id);
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  updateProduct(
    @Args('updateProductInput') updateProductsInput: UpdateProductsInput,
  ) {
    return this.client.send('product.update', updateProductsInput);
  }
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.client.send('product.delete', id);
  }
}
