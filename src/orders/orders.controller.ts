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
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from '../config/service.config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';

import { CurrentUser } from 'src/auth/interfaces';
import { Roles } from 'src/auth/enums/roles-user.enum';

import { catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';
import {
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Orders')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la orden creada con el link de pago en linea',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    const { id: userId, ...data } = user;

    const orderData = {
      ...createOrderDto,
      userId,
    };
    return this.client.send('order.create', orderData).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve todas las ordenes del usuario',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  findAll(@CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser) {
    const { id: userId, ...data } = user;
    return this.client.send('orders.findAll', userId).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('invoice')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiQuery({
    name: 'order',
    description: 'Se colocara el id de la orden para generar la factura',
    example: '/invoice?order=1',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la factura del usuario por medio de la orden',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findInvoiceOrder(
    @Query('order', ParseIntPipe) orderId: number,
    @Res() response: Response,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) infoUser: CurrentUser,
  ) {
    try {
      const { id: userId, role, ...user } = infoUser;

      const orderPaidData = {
        id: orderId,
        userId,
      };

      const orderPaid = await firstValueFrom(
        this.client.send('order.findOnePaid', orderPaidData),
      );

      const fullData = {
        user,
        order: orderPaid,
      };

      const invoiceOrder = await firstValueFrom(
        this.client.send('invoice.create', fullData),
      );
      console.log({ invoiceOrder });
      response.setHeader('Content-Type', 'application/pdf');

      response.setHeader('Content-Disposition', 'inline; filename=factura.pdf');
      const pdf = Buffer.from(invoiceOrder, 'base64');
      response.end(pdf);
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Id de la orden a buscar',
    example: '/1',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el Datos de la orden',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    const { id: userId, ...data } = user;

    return this.client.send('order.findOne', { id, userId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Id de la orden a modificar',
    example: '/1',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve los Datos de la orden',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  remove(
    @Param('id') id: string,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    return this.client.send('order.remove', +id);
  }
}
