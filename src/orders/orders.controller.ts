import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NATS_SERVICE } from '../config/service.config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';

import { CurrentUser } from 'src/auth/interfaces';
import { Roles } from 'src/auth/enums/roles-user.enum';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    return this.client.send('order.create', createOrderDto);
  }

  @Get()
  findAll() {
    return this.client.send('orders.findAll', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('order.findOne', {});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.client.send('order.update', updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('order.remove', +id);
  }
}
