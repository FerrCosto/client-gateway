import { Module } from '@nestjs/common';

import { OptionsController } from './options.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [OptionsController],
  providers: [],
})
export class OptionsModule {}
