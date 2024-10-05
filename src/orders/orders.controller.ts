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
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NATS_SERVICE } from '../config/service.config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';

import { CurrentUser } from 'src/auth/interfaces';
import { Roles } from 'src/auth/enums/roles-user.enum';

import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    const { id: userId, ...data } = user;

    const orderData = {
      ...createOrderDto,
      userId,
    };
    return this.client.send('order.create', orderData);
  }

  @Get()
  findAll() {
    return this.client.send('orders.findAll', {});
  }

  @Get('invoice')
  async findInvoiceOrder(
    @Query('order', ParseIntPipe) orderId: number,
    @Res() response: Response,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    try {
      const { id: userId, ...data } = user;

      const orderPaidData = {
        id: orderId,
        userId,
      };

      const orderPaid = await firstValueFrom(
        this.client.send('order.findOnePaid', orderPaidData),
      );
      console.log(orderPaid);

      const invoiceOrder = await firstValueFrom(
        this.client.send('factura.create', orderPaid),
      );

      response.setHeader('Content-Type', 'application/pdf');

      response.setHeader('Content-Disposition', 'inline; filename=factura.pdf');
      const pdf = Buffer.from(invoiceOrder, 'base64');

      response.end(pdf);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    try {
      const { id: userId, ...data } = user;
      return this.client.send('order.findOne', { id, userId });
    } catch (error) {
      throw new RpcException(error);
    }
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
