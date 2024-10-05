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
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';

import { CurrentUser } from 'src/auth/interfaces';
import { Roles } from 'src/auth/enums/roles-user.enum';

import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { Readable } from 'stream';

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

  @Get('invoice')
  async findInvoiceOrder(
    @Query('order', ParseIntPipe) orderId: number,
    @Res() response: Response,
  ) {
    try {
      // Obtener la orden pagada
      const orderPaid = await firstValueFrom(
        this.client.send('order.findOnePaid', orderId),
      );

      // Generar el PDF utilizando el servicio de factura
      const invoiceOrder = await firstValueFrom(
        this.client.send('factura.create', orderPaid),
      );

      // Configurar los encabezados de la respuesta
      response.setHeader('Content-Type', 'application/pdf');

      response.setHeader(
        'Content-Disposition',
        'inline; filename=factura.pdf', // Cambiar a 'inline' si deseas que se muestre en el navegador
      );
      const pdf = Buffer.from(invoiceOrder, 'base64');

      // Enviar el buffer del PDF como respuesta
      response.end(pdf);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('order.findOne', +id);
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
