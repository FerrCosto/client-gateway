import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/enums/roles-user.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/interfaces';
import { NATS_SERVICE } from 'src/config';

@ApiTags('Options')
@UseGuards(AuthGuard)
@Controller('options')
export class OptionsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve las cantidades requeridas para el dashboard',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('dashboard')
  async countInfo(@CurrentUsers([Roles.ADMIN]) user: CurrentUser) {
    try {
      const [productCount, ordersCount, usersCount] = await Promise.all([
        firstValueFrom(this.client.send('products.count', {})),
        firstValueFrom(this.client.send('orders.count', {})),
        firstValueFrom(this.client.send('user.count', {})),
      ]);

      return { infoCount: { productCount, ordersCount, usersCount } };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
