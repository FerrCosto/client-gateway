import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CurrentUsers } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/interfaces';
import { NATS_SERVICE } from 'src/config';
import { Roles } from './enums/roles-user.enum';
import { catchError } from 'rxjs';
import {
  ApiHeader,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('/all')
  findAllUser(@CurrentUsers(Roles.ADMIN) user: CurrentUser) {
    return this.client.send('user.findAll', {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token to authenticate the request',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el Datos del usuario',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  findById(@CurrentUsers(Roles.ADMIN || Roles.CLIENT) user: CurrentUser) {
    const { id, ...resData } = user;
    return this.client.send('user.findOne', id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUsers(Roles.ADMIN) user: CurrentUser,
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
}
