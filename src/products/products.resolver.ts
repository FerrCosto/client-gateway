import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product } from './entities/products.entity';
import { CreateProdctsInput, UpdateProductsInput } from './dto/inputs';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProdctsInput,
  ) {
    return this.client.send('', createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.client.emit('', {});
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.client.send('', id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductsInput,
  ) {
    return this.client.send('', updateProductInput);
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.client.send('', id);
  }
}
