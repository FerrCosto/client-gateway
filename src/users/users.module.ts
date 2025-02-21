import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
