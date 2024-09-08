import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { NatsModule } from '../transports/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [OrdersController],
  providers: [],
})
export class OrdersModule {}
