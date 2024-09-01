import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { ProductsModule } from './products/products.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [AuthModule, NatsModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
