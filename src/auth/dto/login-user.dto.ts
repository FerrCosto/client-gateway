import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    name: 'email',
    description: 'Correo electronico del usuario',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    name: 'password',
    description: 'Contraseña del usuario',
    type: String,
  })
  @IsString()
  password: string;
}
