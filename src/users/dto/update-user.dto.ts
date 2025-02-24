import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { Roles } from '../enums/roles-user.enum';

export class Direccion {
  @IsString()
  city: string;
  @IsString()
  zip: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  address2?: string;
}
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Direccion)
  direccion?: Direccion;
}

export class UpdateUserRoleDto {
  @IsEnum(Roles, { each: true })
  @IsOptional()
  role?: Roles;
}
