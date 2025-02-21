import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { ProductsModule } from './products/products.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    NatsModule,
    ProductsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    OrdersModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
