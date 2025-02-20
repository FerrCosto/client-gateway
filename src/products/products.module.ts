import { Module } from '@nestjs/common';

import { ProductsResolver } from './products.resolver';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  providers: [ProductsResolver],
})
export class ProductsModule {}
