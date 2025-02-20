import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
