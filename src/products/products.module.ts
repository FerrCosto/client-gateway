import { Module } from '@nestjs/common';

import { ProductsResolver } from './products.resolver';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  providers: [ProductsResolver],
})
export class ProductsModule {}
