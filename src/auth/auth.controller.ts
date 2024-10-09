import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces';
import { AuthGuard } from './guards/auth.guard';
import { NATS_SERVICE } from 'src/config';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    description:
      'Devuelve la informacion del usuario necesaria y su token de autentificación',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ description: 'Informacion del usuario', type: RegisterUserDto })
  singUp(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description:
      'Devuelve la informacion del usuario necesaria y su token de autentificación',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ description: 'Informacion del usuario', type: LoginUserDto })
  singIn(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  @ApiResponse({
    status: 200,
    description:
      'Devuelve la informacion del usuario necesaria y su token de autentificación',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ description: 'Informacion del usuario', type: LoginUserDto })
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
