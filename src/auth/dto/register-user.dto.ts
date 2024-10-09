import {
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { Roles } from '../enums/roles-user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class Direccion {
  @ApiProperty({
    name: 'city',
    description: 'Ciudad del usuario',
    type: String,
  })
  @IsString()
  city: string;
  @ApiProperty({
    name: 'street',
    description: 'Dirección exacta del usuario',
    type: String,
  })
  @IsString()
  street: string;
  @ApiProperty({
    name: 'postal',
    description: 'Código postal donde se encuentra la ciudad',
    type: Number,
  })
  @IsInt()
  postal: number;
}
export class RegisterUserDto {
  @ApiProperty({
    name: 'fullName',
    description: 'Nombre completo del usuario',
    type: String,
  })
  @IsString()
  fullName: string;
  @ApiProperty({
    name: 'email',
    description: 'Correo electronico del usuario',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    name: 'password',
    description: 'Contraseña del Usuario',
    type: String,
  })
  @IsString()
  password: string;
  @ApiProperty({
    name: 'direccion',
    description: 'Dirección del usaurio',
    type: () => Direccion,
  })
  @IsObject()
  direccion: Direccion;
  @ApiProperty({
    name: 'telefono',
    description: 'Numero de telefono',
    example: '+573123456789',
    type: String,
  })
  @IsPhoneNumber('CO')
  telefono: number;
  @ApiProperty({
    name: 'roles',
    description: 'Roles que tendra el usuario',
    default: ['CLIENT'],
    enum: ['ADMIN', 'CLIENT'],
    isArray: true,
  })
  @IsEnum(Roles, { each: true })
  roles: Roles[] = [Roles.CLIENT];
}
