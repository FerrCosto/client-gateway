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
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NATS_SERVICE } from '../config/service.config';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
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
