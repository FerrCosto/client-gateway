import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/interfaces';
import { NATS_SERVICE } from 'src/config';
import { Roles } from './enums/roles-user.enum';
import { catchError, throwError } from 'rxjs';
import {
  ApiHeader,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto, UpdateUserRoleDto } from './dto';

@Controller('users')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token to authenticate the request',
  required: true,
})
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve todos los datos de los usuarios',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('/all')
  findAllUser(@CurrentUsers([Roles.ADMIN]) user: CurrentUser) {
    return this.client.send('user.findAll', {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el Datos del usuario',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  findById(@CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser) {
    const { id, ...resData } = user;
    return this.client.send('user.findOne', id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Edita los datos del usuario',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id')
  updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUsers([Roles.ADMIN]) user: CurrentUser,
  ) {
    const data = {
      id,
      role: updateUserRoleDto.role,
    };
    return this.client.send('user.updateRole', data).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Edita los datos del usuario',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put('/info/:id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUsers([Roles.ADMIN, Roles.CLIENT]) user: CurrentUser,
  ) {
    try {
      const { id: userId, ...resData } = user;
      console.log({ id, userId });
      if (userId !== id)
        return throwError(
          () =>
            new RpcException({
              status: 401,
              message: 'No tienes privilegios',
            }),
        );

      const data = {
        id,
        ...updateUserDto,
      };
      return this.client.send('user.update', data).pipe(
        catchError((error) => {
          throw new RpcException(error.error);
        }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Eliminar el usuario',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Delete(':id')
  removeUser(
    @Param('id') id: string,
    @CurrentUsers([Roles.ADMIN]) user: CurrentUser,
  ) {
    return this.client.send('user.remove', id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
